import { Request, Response } from "express";
import { MinibarService } from "@/services/minibarService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import { 
    createMinibarItemSchema, 
    updateMinibarItemSchema, 
    createMinibarConsumptionSchema 
} from "@/utils/validators";

export class MinibarController {
    // ========================================
    // GESTÃO DE ITENS DO MINIBAR
    // ========================================

    // Listar todos os itens
    static async getAllItems(req: Request, res: Response) {
        try {
            const items = await MinibarService.getAllItems();
            return ResponseHandler.success(res, items, "Itens do minibar listados com sucesso");
        } catch (error) {
            console.error("Erro ao listar itens do minibar:", error);
            return ResponseHandler.error(res, "Erro ao listar itens do minibar", 500);
        }
    }

    // Obter item por ID
    static async getItemById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            
            const item = await MinibarService.getItemById(parseInt(id));
            
            if (!item) {
                return ResponseHandler.error(res, "Item não encontrado", 404);
            }
            
            return ResponseHandler.success(res, item, "Item encontrado com sucesso");
        } catch (error) {
            console.error("Erro ao obter item do minibar:", error);
            return ResponseHandler.error(res, "Erro ao obter item do minibar", 500);
        }
    }

    // Criar novo item
    static async createItem(req: Request, res: Response) {
        try {
            const { error } = createMinibarItemSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const item = await MinibarService.createItem(req.body);
            return ResponseHandler.success(res, item, "Item criado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar item do minibar:", error);
            return ResponseHandler.error(res, "Erro ao criar item do minibar", 500);
        }
    }

    // Atualizar item
    static async updateItem(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            
            const { error } = updateMinibarItemSchema.validate(req.body);
            
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const item = await MinibarService.updateItem(parseInt(id), req.body);
            
            if (!item) {
                return ResponseHandler.error(res, "Item não encontrado", 404);
            }
            
            return ResponseHandler.success(res, item, "Item atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar item do minibar:", error);
            return ResponseHandler.error(res, "Erro ao atualizar item do minibar", 500);
        }
    }

    // Deletar item
    static async deleteItem(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            
            const deleted = await MinibarService.deleteItem(parseInt(id));
            
            if (!deleted) {
                return ResponseHandler.error(res, "Item não encontrado", 404);
            }
            
            return ResponseHandler.success(res, null, "Item deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar item do minibar:", error);
            return ResponseHandler.error(res, "Erro ao deletar item do minibar", 500);
        }
    }

    // Obter itens por categoria
    static async getItemsByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            if (!category) {
                return ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            
            const items = await MinibarService.getItemsByCategory(category);
            return ResponseHandler.success(res, items, "Itens da categoria listados com sucesso");
        } catch (error) {
            console.error("Erro ao listar itens por categoria:", error);
            return ResponseHandler.error(res, "Erro ao listar itens por categoria", 500);
        }
    }

    // Obter categorias disponíveis
    static async getCategories(req: Request, res: Response) {
        try {
            const categories = await MinibarService.getCategories();
            return ResponseHandler.success(res, categories, "Categorias listadas com sucesso");
        } catch (error) {
            console.error("Erro ao listar categorias:", error);
            return ResponseHandler.error(res, "Erro ao listar categorias", 500);
        }
    }

    // ========================================
    // GESTÃO DE CONSUMO DO MINIBAR
    // ========================================

    // Registrar consumo
    static async recordConsumption(req: AuthRequest, res: Response) {
        try {
            const { error } = createMinibarConsumptionSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            // Verificar se a reserva existe e está ativa
            const isValidReservation = await MinibarService.validateReservation(req.body.reservation_id);
            if (!isValidReservation) {
                return ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
            }

            const consumptionData = {
                ...req.body,
                recorded_by: req.user!.userId
            };

            const consumption = await MinibarService.recordConsumption(consumptionData);
            return ResponseHandler.success(res, consumption, "Consumo registrado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao registrar consumo:", error);
            if (error instanceof Error && error.message.includes('não encontrado')) {
                return ResponseHandler.error(res, error.message, 400);
            }
            return ResponseHandler.error(res, "Erro ao registrar consumo", 500);
        }
    }

    // Obter consumo por reserva
    static async getConsumptionByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const consumption = await MinibarService.getConsumptionByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, consumption, "Consumo da reserva obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter consumo da reserva:", error);
            return ResponseHandler.error(res, "Erro ao obter consumo da reserva", 500);
        }
    }

    // Obter consumo por período
    static async getConsumptionByPeriod(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }

            const consumption = await MinibarService.getConsumptionByPeriod(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            return ResponseHandler.success(res, consumption, "Consumo do período obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter consumo por período:", error);
            return ResponseHandler.error(res, "Erro ao obter consumo por período", 500);
        }
    }

    // Obter total de consumo por reserva
    static async getTotalConsumptionByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const total = await MinibarService.getTotalConsumptionByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, { total }, "Total de consumo obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter total de consumo:", error);
            return ResponseHandler.error(res, "Erro ao obter total de consumo", 500);
        }
    }

    // Obter estatísticas de consumo
    static async getConsumptionStats(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            let start: Date | undefined;
            let end: Date | undefined;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
            }

            const stats = await MinibarService.getConsumptionStats(start, end);
            return ResponseHandler.success(res, stats, "Estatísticas de consumo obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter estatísticas de consumo:", error);
            return ResponseHandler.error(res, "Erro ao obter estatísticas de consumo", 500);
        }
    }

    // Obter consumo por item
    static async getConsumptionByItem(req: Request, res: Response) {
        try {
            const { itemId } = req.params;
            if (!itemId) {
                return ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            
            const { startDate, endDate } = req.query;
            
            let start: Date | undefined;
            let end: Date | undefined;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
            }

            const consumption = await MinibarService.getConsumptionByItem(parseInt(itemId), start, end);
            return ResponseHandler.success(res, consumption, "Consumo do item obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter consumo do item:", error);
            return ResponseHandler.error(res, "Erro ao obter consumo do item", 500);
        }
    }
}
