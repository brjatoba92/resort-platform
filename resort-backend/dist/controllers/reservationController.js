"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const reservationService_1 = require("@/services/reservationService");
const guestService_1 = require("@/services/guestService");
const roomService_1 = require("@/services/roomService");
const responses_1 = require("@/utils/responses");
const joi_1 = __importDefault(require("joi"));
const createReservationSchema = joi_1.default.object({
    guest: joi_1.default.object({
        name: joi_1.default.string().required().messages({
            'any.required': 'Nome do hóspede é obrigatório'
        }),
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Email deve ter formato válido',
            'any.required': 'Email do hóspede é obrigatório'
        }),
        phone: joi_1.default.string().optional(),
        document: joi_1.default.string().required().messages({
            'any.required': 'Documento do hóspede é obrigatório'
        }),
        nationality: joi_1.default.string().optional(),
        language_preference: joi_1.default.string().valid('pt', 'en', 'es').optional()
    }).required(),
    room_id: joi_1.default.number().required().messages({
        'any.required': 'ID do quarto é obrigatório'
    }),
    check_in_date: joi_1.default.date().iso().min('now').required().messages({
        'date.min': 'Data de check-in deve ser hoje ou no futuro',
        'any.required': 'Data de check-in é obrigatória'
    }),
    check_out_date: joi_1.default.date().iso().greater(joi_1.default.ref('check_in_date')).required().messages({
        'date.greater': 'Data de check-out deve ser posterior ao check-in',
        'any.required': 'Data de check-out é obrigatória'
    }),
    total_guests: joi_1.default.number().min(1).required().messages({
        'number.min': 'Deve haver pelo menos 1 hóspede',
        'any.required': 'Número total de hóspedes é obrigatório'
    }),
    special_requests: joi_1.default.string().optional()
});
class ReservationController {
    static async getAllReservations(req, res) {
        try {
            const filters = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10
            };
            if (req.query.status)
                filters.status = req.query.status;
            if (req.query.room_id)
                filters.room_id = parseInt(req.query.room_id);
            if (req.query.guest_id)
                filters.guest_id = parseInt(req.query.guest_id);
            if (req.query.date_from)
                filters.date_from = req.query.date_from;
            if (req.query.date_to)
                filters.date_to = req.query.date_to;
            const result = await reservationService_1.ReservationService.getReservations(filters);
            return responses_1.ResponseHandler.success(res, result, 'Reservas listadas com sucesso');
        }
        catch (error) {
            console.error('Erro ao listar reservas:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async getReservationById(req, res) {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
            }
            const reservation = await reservationService_1.ReservationService.getReservationById(parseInt(reservationId));
            if (!reservation) {
                return responses_1.ResponseHandler.error(res, 'Reserva não encontrada', 404);
            }
            return responses_1.ResponseHandler.success(res, reservation, 'Reserva encontrada');
        }
        catch (error) {
            console.error('Erro ao buscar reserva:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async createReservation(req, res) {
        try {
            const { error } = createReservationSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }
            const { guest: guestData, room_id, check_in_date, check_out_date, total_guests, special_requests } = req.body;
            const room = await roomService_1.RoomService.getRoomById(room_id);
            if (!room) {
                return responses_1.ResponseHandler.error(res, 'Quarto não encontrado', 404);
            }
            if (total_guests > room.capacity) {
                return responses_1.ResponseHandler.error(res, `Quarto comporta no máximo ${room.capacity} hóspedes`, 400);
            }
            const checkInDate = new Date(check_in_date);
            const checkOutDate = new Date(check_out_date);
            const isAvailable = await roomService_1.RoomService.checkAvailability(room_id, checkInDate, checkOutDate);
            if (!isAvailable) {
                return responses_1.ResponseHandler.error(res, 'Quarto não está disponível no período solicitado', 409);
            }
            const guest = await guestService_1.GuestService.findOrCreateGuest(guestData);
            const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
            const totalAmount = nights * room.price_per_night;
            const reservationData = {
                guest_id: guest.id,
                room_id,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                total_guests,
                total_amount: totalAmount,
                special_requests,
                created_by: req.user.userId
            };
            const reservation = await reservationService_1.ReservationService.createReservation(reservationData);
            return responses_1.ResponseHandler.created(res, reservation, 'Reserva criada com sucesso');
        }
        catch (error) {
            console.error('Erro ao criar reserva:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async checkIn(req, res) {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
            }
            const reservation = await reservationService_1.ReservationService.checkIn(parseInt(reservationId));
            if (!reservation) {
                return responses_1.ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser feito check-in', 404);
            }
            return responses_1.ResponseHandler.success(res, reservation, 'Check-in realizado com sucesso');
        }
        catch (error) {
            console.error('Erro no check-in:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async checkOut(req, res) {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
            }
            const additionalCharges = parseFloat(req.body.additional_charges) || 0;
            const reservation = await reservationService_1.ReservationService.checkOut(parseInt(reservationId), additionalCharges);
            if (!reservation) {
                return responses_1.ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser feito check-out', 404);
            }
            return responses_1.ResponseHandler.success(res, reservation, 'Check-out realizado com sucesso');
        }
        catch (error) {
            console.error('Erro no check-out:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async cancelReservation(req, res) {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
            }
            const reservation = await reservationService_1.ReservationService.cancelReservation(parseInt(reservationId));
            if (!reservation) {
                return responses_1.ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser cancelada', 404);
            }
            return responses_1.ResponseHandler.success(res, reservation, 'Reserva cancelada com sucesso');
        }
        catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async confirmReservation(req, res) {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
            }
            return responses_1.ResponseHandler.error(res, 'Funcionalidade de confirmação não implementada', 501);
        }
        catch (error) {
            console.error('Erro ao confirmar reserva:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async getUpcomingCheckouts(req, res) {
        try {
            const checkouts = await reservationService_1.ReservationService.getUpcomingCheckOuts();
            return responses_1.ResponseHandler.success(res, checkouts, 'Check-outs do dia obtidos com sucesso');
        }
        catch (error) {
            console.error('Erro ao obter check-outs:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async getTodayCheckIns(req, res) {
        try {
            const checkIns = await reservationService_1.ReservationService.getTodayCheckIns();
            return responses_1.ResponseHandler.success(res, checkIns, 'Check-ins de hoje obtidos com sucesso');
        }
        catch (error) {
            console.error('Erro ao obter check-ins:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
}
exports.ReservationController = ReservationController;
//# sourceMappingURL=reservationController.js.map