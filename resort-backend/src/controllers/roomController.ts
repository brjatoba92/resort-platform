import { Request, Response } from "express";
import { RoomService } from "@/services/roomService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import Joi from "joi";

// Schemas de validação
const createRoomSchema = Joi.object({
    number: Joi.string().required().messages({
        'any.required': 'Numero do quarto é obrigatorio'
    }),
    type: Joi.string().required().messages({
        'any.required': 'Tipo de quarto é obrigatorio'
    }),
    capacity: Joi.number().min(1).required().messages({
        'number.min': 'Capacidade do quarto deve ser maior que 1',
        'any.required': 'Capacidade do quarto é obrigatorio'
    }),
    price_per_night: Joi.number().min(0).required().messages({
        'number.min': 'Preço do quarto deve ser maior que 0',
        'any.required': 'Preço do quarto é obrigatorio'
    }),
    amenities: Joi.array().items(Joi.string()).optional(),
    floor: Joi.number().optional(),
    description: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
});

const updateRoomSchema = Joi.object({
    number: Joi.string().optional(),
    type: Joi.string().optional(),
    capacity: Joi.number().min(1).optional(),
    price_per_night: Joi.number().min(0).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'cleaning').optional(),
    floor: Joi.number().optional(),
    description: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
});

const availabilitySchema = Joi.object({
    check_in: Joi.date().iso().required().messages({
        'any.required': 'Data de check-in é obrigatoria'
    }),
    check_out: Joi.date().iso().greater(Joi.ref('check_in')).required().messages({
        'date.greater': 'Data de check-out deve ser maior que a data de check-in',
        'any.required': 'Data de check-out é obrigatoria'
    })
});

export class RoomController {
    // Listar quartos
    static async getAllRooms(req: AuthRequest, res: Response) {
        try {
            const filters: any = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            };

            if (req.query.status) filters.status = req.query.status as string;
            if (req.query.type) filters.type = req.query.type as string;
            if (req.query.floor) filters.floor = parseInt(req.query.floor as string);

            const result = await RoomService.getAllRooms(filters);
            return ResponseHandler.success(res, result, 'Quartos listados com sucesso');
        } catch (error) {
            console.error('Erro ao listar quartos:', error);
            return ResponseHandler.error(res, 'Erro ao listar quartos', 500);
        }
    }

    // Obter quarto por ID
    static async getRoomById(req: AuthRequest, res: Response) {
        try {
          const roomId = req.params.id;
          if (!roomId) {
            return ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
          }
    
          const room = await RoomService.getRoomById(roomId);
          if (!room) {
            return ResponseHandler.error(res, 'Quarto não encontrado', 404);
          }
    
          return ResponseHandler.success(res, room, 'Quarto encontrado');
    
        } catch (error) {
          console.error('Erro ao buscar quarto:', error);
          return ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
      }
    

    // Criar novo quarto
    static async createRoom(req: AuthRequest, res: Response) {
        try {
            const { error } = createRoomSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.message, 400);
            }
            const room = await RoomService.createRoom(req.body);
            return ResponseHandler.created(res, room, 'Quarto criado com sucesso');
        } catch (error: any) {
            console.error('Erro ao criar quarto:', error);
            if (error.code === '23505') {
                return ResponseHandler.error(res, 'Quarto já existe', 400);
            }
            return ResponseHandler.error(res, 'Erro ao criar quarto', 500);
        }
    }

    // Atualizar quarto
    static async updateRoom(req: AuthRequest, res: Response) {
        try {
            const roomId = req.params.id;
            if (!roomId) {
                return ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
            }
            const { error } = updateRoomSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.message, 400);
            }
            const room = await RoomService.updateRoom(roomId, req.body);
            return ResponseHandler.success(res, room, 'Quarto atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar quarto:', error);
            return ResponseHandler.error(res, 'Erro ao atualizar quarto', 500);
        }
    }

    // Deletar quarto
    static async deleteRoom(req: AuthRequest, res: Response) {
        try {
            const roomId = req.params.id;
            if (!roomId) {
                return ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
            }
            await RoomService.deleteRoom(roomId);
            return ResponseHandler.success(res, null, 'Quarto deletado com sucesso');
        } catch (error) {
            console.error('Erro ao deletar quarto:', error);
            return ResponseHandler.error(res, 'Erro ao deletar quarto', 500);
        }
    }
    
    // Verificar disponibilidade
    static async checkAvailability(req: AuthRequest, res: Response) {
        try {
            const { error } = availabilitySchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.message, 400);
            }
            const { check_in, check_out } = req.body;
            const availability = await RoomService.getAvailableRooms(check_in, check_out);
            return ResponseHandler.success(res, availability, 'Disponibilidade verificada com sucesso');
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return ResponseHandler.error(res, 'Erro ao verificar disponibilidade', 500);
        }
    }
}


