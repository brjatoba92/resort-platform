"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinibarController = void 0;
const minibarService_1 = require("@/services/minibarService");
const responses_1 = require("@/utils/responses");
const validators_1 = require("@/utils/validators");
class MinibarController {
    static async getAllItems(req, res) {
        try {
            const items = await minibarService_1.MinibarService.getAllItems();
            return responses_1.ResponseHandler.success(res, items, "Itens do minibar listados com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar itens do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar itens do minibar", 500);
        }
    }
    static async getItemById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            const item = await minibarService_1.MinibarService.getItemById(parseInt(id));
            if (!item) {
                return responses_1.ResponseHandler.error(res, "Item não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, item, "Item encontrado com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter item do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter item do minibar", 500);
        }
    }
    static async createItem(req, res) {
        try {
            const { error } = validators_1.createMinibarItemSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const item = await minibarService_1.MinibarService.createItem(req.body);
            return responses_1.ResponseHandler.success(res, item, "Item criado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar item do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar item do minibar", 500);
        }
    }
    static async updateItem(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            const { error } = validators_1.updateMinibarItemSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const item = await minibarService_1.MinibarService.updateItem(parseInt(id), req.body);
            if (!item) {
                return responses_1.ResponseHandler.error(res, "Item não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, item, "Item atualizado com sucesso");
        }
        catch (error) {
            console.error("Erro ao atualizar item do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao atualizar item do minibar", 500);
        }
    }
    static async deleteItem(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            const deleted = await minibarService_1.MinibarService.deleteItem(parseInt(id));
            if (!deleted) {
                return responses_1.ResponseHandler.error(res, "Item não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, null, "Item deletado com sucesso");
        }
        catch (error) {
            console.error("Erro ao deletar item do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao deletar item do minibar", 500);
        }
    }
    static async getItemsByCategory(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                return responses_1.ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            const items = await minibarService_1.MinibarService.getItemsByCategory(category);
            return responses_1.ResponseHandler.success(res, items, "Itens da categoria listados com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar itens por categoria:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar itens por categoria", 500);
        }
    }
    static async getCategories(req, res) {
        try {
            const categories = await minibarService_1.MinibarService.getCategories();
            return responses_1.ResponseHandler.success(res, categories, "Categorias listadas com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar categorias:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar categorias", 500);
        }
    }
    static async recordConsumption(req, res) {
        try {
            const { error } = validators_1.createMinibarConsumptionSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const isValidReservation = await minibarService_1.MinibarService.validateReservation(req.body.reservation_id);
            if (!isValidReservation) {
                return responses_1.ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
            }
            const consumptionData = {
                ...req.body,
                recorded_by: req.user.userId
            };
            const consumption = await minibarService_1.MinibarService.recordConsumption(consumptionData);
            return responses_1.ResponseHandler.success(res, consumption, "Consumo registrado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao registrar consumo:", error);
            if (error instanceof Error && error.message.includes('não encontrado')) {
                return responses_1.ResponseHandler.error(res, error.message, 400);
            }
            return responses_1.ResponseHandler.error(res, "Erro ao registrar consumo", 500);
        }
    }
    static async getConsumptionByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const consumption = await minibarService_1.MinibarService.getConsumptionByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, consumption, "Consumo da reserva obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter consumo da reserva:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter consumo da reserva", 500);
        }
    }
    static async getConsumptionByPeriod(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return responses_1.ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }
            const consumption = await minibarService_1.MinibarService.getConsumptionByPeriod(new Date(startDate), new Date(endDate));
            return responses_1.ResponseHandler.success(res, consumption, "Consumo do período obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter consumo por período:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter consumo por período", 500);
        }
    }
    static async getTotalConsumptionByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const total = await minibarService_1.MinibarService.getTotalConsumptionByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, { total }, "Total de consumo obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter total de consumo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter total de consumo", 500);
        }
    }
    static async getConsumptionStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            let start;
            let end;
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            }
            const stats = await minibarService_1.MinibarService.getConsumptionStats(start, end);
            return responses_1.ResponseHandler.success(res, stats, "Estatísticas de consumo obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter estatísticas de consumo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter estatísticas de consumo", 500);
        }
    }
    static async getConsumptionByItem(req, res) {
        try {
            const { itemId } = req.params;
            if (!itemId) {
                return responses_1.ResponseHandler.error(res, "ID do item é obrigatório", 400);
            }
            const { startDate, endDate } = req.query;
            let start;
            let end;
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            }
            const consumption = await minibarService_1.MinibarService.getConsumptionByItem(parseInt(itemId), start, end);
            return responses_1.ResponseHandler.success(res, consumption, "Consumo do item obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter consumo do item:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter consumo do item", 500);
        }
    }
}
exports.MinibarController = MinibarController;
//# sourceMappingURL=minibarController.js.map