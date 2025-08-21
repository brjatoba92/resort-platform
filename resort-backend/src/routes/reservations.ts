import { Router } from "express";
import { ReservationController } from "@/controllers/reservationController";
import { authenticate, authorize } from "@/middleware/auth";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas gerais (admin e employee)
router.get('/', ReservationController.getAllReservations);
router.get('/upcoming-checkouts', ReservationController.getUpcomingCheckouts);
router.get('/today-checkins', ReservationController.getTodayCheckIns);
router.get('/:id', ReservationController.getReservationById);
router.post('/', ReservationController.createReservation);
router.post('/:id/checkin', ReservationController.checkIn);
router.post('/:id/checkout', ReservationController.checkOut);
router.post('/:id/confirm', ReservationController.confirmReservation);

// Apenas admins podem cancelar reservas
router.post('/:id/cancel', authorize(['admin']), ReservationController.cancelReservation);

export default router;