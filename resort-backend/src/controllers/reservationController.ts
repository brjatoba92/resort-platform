import { Response } from 'express';
import { ReservationService } from '@/services/reservationService';
import { GuestService } from '@/services/guestService';
import { RoomService } from '@/services/roomService';
import { ResponseHandler } from '@/utils/responses';
import { AuthRequest } from '@/middleware/auth';
import Joi from 'joi';

// Schemas de validação
const createReservationSchema = Joi.object({
  guest: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Nome do hóspede é obrigatório'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter formato válido',
      'any.required': 'Email do hóspede é obrigatório'
    }),
    phone: Joi.string().optional(),
    document: Joi.string().required().messages({
      'any.required': 'Documento do hóspede é obrigatório'
    }),
    nationality: Joi.string().optional(),
    language_preference: Joi.string().valid('pt', 'en', 'es').optional()
  }).required(),
  room_id: Joi.number().required().messages({
    'any.required': 'ID do quarto é obrigatório'
  }),
  check_in_date: Joi.date().iso().min('now').required().messages({
    'date.min': 'Data de check-in deve ser hoje ou no futuro',
    'any.required': 'Data de check-in é obrigatória'
  }),
  check_out_date: Joi.date().iso().greater(Joi.ref('check_in_date')).required().messages({
    'date.greater': 'Data de check-out deve ser posterior ao check-in',
    'any.required': 'Data de check-out é obrigatória'
  }),
  total_guests: Joi.number().min(1).required().messages({
    'number.min': 'Deve haver pelo menos 1 hóspede',
    'any.required': 'Número total de hóspedes é obrigatório'
  }),
  special_requests: Joi.string().optional()
});

export class ReservationController {
  // Listar reservas
  static async getAllReservations(req: AuthRequest, res: Response) {
    try {
      const filters: any = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };

      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.room_id) filters.room_id = parseInt(req.query.room_id as string);
      if (req.query.guest_id) filters.guest_id = parseInt(req.query.guest_id as string);
      if (req.query.date_from) filters.date_from = req.query.date_from as string;
      if (req.query.date_to) filters.date_to = req.query.date_to as string;

      const result = await ReservationService.getReservations(filters);
      return ResponseHandler.success(res, result, 'Reservas listadas com sucesso');

    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Obter reserva por ID
  static async getReservationById(req: AuthRequest, res: Response) {
    try {
      const reservationId = req.params.id;
      if (!reservationId) {
        return ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
      }

      const reservation = await ReservationService.getReservationById(parseInt(reservationId));
      if (!reservation) {
        return ResponseHandler.error(res, 'Reserva não encontrada', 404);
      }

      return ResponseHandler.success(res, reservation, 'Reserva encontrada');

    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Criar nova reserva
  static async createReservation(req: AuthRequest, res: Response) {
    try {
      const { error } = createReservationSchema.validate(req.body);
      if (error) {
        return ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
      }

      const { guest: guestData, room_id, check_in_date, check_out_date, total_guests, special_requests } = req.body;

      // Verificar se o quarto existe
      const room = await RoomService.getRoomById(room_id);
      if (!room) {
        return ResponseHandler.error(res, 'Quarto não encontrado', 404);
      }

      // Verificar capacidade do quarto
      if (total_guests > room.capacity) {
        return ResponseHandler.error(res, `Quarto comporta no máximo ${room.capacity} hóspedes`, 400);
      }

      // Verificar disponibilidade
      const checkInDate = new Date(check_in_date);
      const checkOutDate = new Date(check_out_date);
      
      const isAvailable = await RoomService.checkAvailability(room_id, checkInDate, checkOutDate);
      if (!isAvailable) {
        return ResponseHandler.error(res, 'Quarto não está disponível no período solicitado', 409);
      }

      // Criar ou encontrar hóspede
      const guest = await GuestService.findOrCreateGuest(guestData);

      // Calcular valor total
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const totalAmount = nights * room.price_per_night;

      // Criar reserva
      const reservationData = {
        guest_id: guest.id,
        room_id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_guests,
        total_amount: totalAmount,
        special_requests,
        created_by: req.user!.userId
      };

      const reservation = await ReservationService.createReservation(reservationData);
      return ResponseHandler.created(res, reservation, 'Reserva criada com sucesso');

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Check-in
  static async checkIn(req: AuthRequest, res: Response) {
    try {
      const reservationId = req.params.id;
      if (!reservationId) {
        return ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
      }

      const reservation = await ReservationService.checkIn(parseInt(reservationId));
      if (!reservation) {
        return ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser feito check-in', 404);
      }

      return ResponseHandler.success(res, reservation, 'Check-in realizado com sucesso');

    } catch (error) {
      console.error('Erro no check-in:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Check-out
  static async checkOut(req: AuthRequest, res: Response) {
    try {
      const reservationId = req.params.id;
      if (!reservationId) {
        return ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
      }

      const additionalCharges = parseFloat(req.body.additional_charges) || 0;

      const reservation = await ReservationService.checkOut(parseInt(reservationId), additionalCharges);
      if (!reservation) {
        return ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser feito check-out', 404);
      }

      return ResponseHandler.success(res, reservation, 'Check-out realizado com sucesso');

    } catch (error) {
      console.error('Erro no check-out:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Cancelar reserva
  static async cancelReservation(req: AuthRequest, res: Response) {
    try {
      const reservationId = req.params.id;
      if (!reservationId) {
        return ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
      }

      const reservation = await ReservationService.cancelReservation(parseInt(reservationId));
      if (!reservation) {
        return ResponseHandler.error(res, 'Reserva não encontrada ou não pode ser cancelada', 404);
      }

      return ResponseHandler.success(res, reservation, 'Reserva cancelada com sucesso');

    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Confirmar reserva
  static async confirmReservation(req: AuthRequest, res: Response) {
    try {
      const reservationId = req.params.id;
      if (!reservationId) {
        return ResponseHandler.error(res, 'ID da reserva é obrigatório', 400);
      }

      // Implementar lógica de confirmação aqui
      // Por enquanto, vamos apenas retornar um erro informando que não está implementado
      return ResponseHandler.error(res, 'Funcionalidade de confirmação não implementada', 501);

    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Obter check-outs próximos
  static async getUpcomingCheckouts(req: AuthRequest, res: Response) {
    try {
      const checkouts = await ReservationService.getUpcomingCheckOuts();
      return ResponseHandler.success(res, checkouts, 'Check-outs do dia obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao obter check-outs:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Obter check-ins de hoje
  static async getTodayCheckIns(req: AuthRequest, res: Response) {
    try {
      const checkIns = await ReservationService.getTodayCheckIns();
      return ResponseHandler.success(res, checkIns, 'Check-ins de hoje obtidos com sucesso');

    } catch (error) {
      console.error('Erro ao obter check-ins:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }
}