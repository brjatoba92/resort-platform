"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const roomService_1 = require("@/services/roomService");
const responses_1 = require("@/utils/responses");
const joi_1 = __importDefault(require("joi"));
const createRoomSchema = joi_1.default.object({
    number: joi_1.default.string().required().messages({
        'any.required': 'Numero do quarto é obrigatorio'
    }),
    type: joi_1.default.string().required().messages({
        'any.required': 'Tipo de quarto é obrigatorio'
    }),
    capacity: joi_1.default.number().min(1).required().messages({
        'number.min': 'Capacidade do quarto deve ser maior que 1',
        'any.required': 'Capacidade do quarto é obrigatorio'
    }),
    price_per_night: joi_1.default.number().min(0).required().messages({
        'number.min': 'Preço do quarto deve ser maior que 0',
        'any.required': 'Preço do quarto é obrigatorio'
    }),
    amenities: joi_1.default.array().items(joi_1.default.string()).optional(),
    floor: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
    images: joi_1.default.array().items(joi_1.default.string().uri()).optional(),
});
const updateRoomSchema = joi_1.default.object({
    number: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    capacity: joi_1.default.number().min(1).optional(),
    price_per_night: joi_1.default.number().min(0).optional(),
    amenities: joi_1.default.array().items(joi_1.default.string()).optional(),
    status: joi_1.default.string().valid('available', 'occupied', 'maintenance', 'cleaning').optional(),
    floor: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
    images: joi_1.default.array().items(joi_1.default.string().uri()).optional(),
});
const availabilitySchema = joi_1.default.object({
    check_in: joi_1.default.date().iso().required().messages({
        'any.required': 'Data de check-in é obrigatoria'
    }),
    check_out: joi_1.default.date().iso().greater(joi_1.default.ref('check_in')).required().messages({
        'date.greater': 'Data de check-out deve ser maior que a data de check-in',
        'any.required': 'Data de check-out é obrigatoria'
    })
});
class RoomController {
    static async getAllRooms(req, res) {
        try {
            const filters = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
            };
            if (req.query.status)
                filters.status = req.query.status;
            if (req.query.type)
                filters.type = req.query.type;
            if (req.query.floor)
                filters.floor = parseInt(req.query.floor);
            const result = await roomService_1.RoomService.getAllRooms(filters);
            return responses_1.ResponseHandler.success(res, result, 'Quartos listados com sucesso');
        }
        catch (error) {
            console.error('Erro ao listar quartos:', error);
            return responses_1.ResponseHandler.error(res, 'Erro ao listar quartos', 500);
        }
    }
    static async getRoomById(req, res) {
        try {
            const roomId = req.params.id;
            if (!roomId) {
                return responses_1.ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
            }
            const room = await roomService_1.RoomService.getRoomById(roomId);
            if (!room) {
                return responses_1.ResponseHandler.error(res, 'Quarto não encontrado', 404);
            }
            return responses_1.ResponseHandler.success(res, room, 'Quarto encontrado');
        }
        catch (error) {
            console.error('Erro ao buscar quarto:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async createRoom(req, res) {
        try {
            const { error } = createRoomSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.message, 400);
            }
            const room = await roomService_1.RoomService.createRoom(req.body);
            return responses_1.ResponseHandler.created(res, room, 'Quarto criado com sucesso');
        }
        catch (error) {
            console.error('Erro ao criar quarto:', error);
            if (error.code === '23505') {
                return responses_1.ResponseHandler.error(res, 'Quarto já existe', 400);
            }
            return responses_1.ResponseHandler.error(res, 'Erro ao criar quarto', 500);
        }
    }
    static async updateRoom(req, res) {
        try {
            const roomId = req.params.id;
            if (!roomId) {
                return responses_1.ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
            }
            const { error } = updateRoomSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.message, 400);
            }
            const room = await roomService_1.RoomService.updateRoom(roomId, req.body);
            return responses_1.ResponseHandler.success(res, room, 'Quarto atualizado com sucesso');
        }
        catch (error) {
            console.error('Erro ao atualizar quarto:', error);
            return responses_1.ResponseHandler.error(res, 'Erro ao atualizar quarto', 500);
        }
    }
    static async deleteRoom(req, res) {
        try {
            const roomId = req.params.id;
            if (!roomId) {
                return responses_1.ResponseHandler.error(res, 'ID do quarto é obrigatório', 400);
            }
            await roomService_1.RoomService.deleteRoom(roomId);
            return responses_1.ResponseHandler.success(res, null, 'Quarto deletado com sucesso');
        }
        catch (error) {
            console.error('Erro ao deletar quarto:', error);
            return responses_1.ResponseHandler.error(res, 'Erro ao deletar quarto', 500);
        }
    }
    static async checkAvailability(req, res) {
        try {
            const { error } = availabilitySchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.message, 400);
            }
            const { check_in, check_out } = req.body;
            const availability = await roomService_1.RoomService.getAvailableRooms(check_in, check_out);
            return responses_1.ResponseHandler.success(res, availability, 'Disponibilidade verificada com sucesso');
        }
        catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return responses_1.ResponseHandler.error(res, 'Erro ao verificar disponibilidade', 500);
        }
    }
}
exports.RoomController = RoomController;
//# sourceMappingURL=roomController.js.map