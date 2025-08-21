"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservationController_1 = require("@/controllers/reservationController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', reservationController_1.ReservationController.getAllReservations);
router.get('/upcoming-checkouts', reservationController_1.ReservationController.getUpcomingCheckouts);
router.get('/today-checkins', reservationController_1.ReservationController.getTodayCheckIns);
router.get('/:id', reservationController_1.ReservationController.getReservationById);
router.post('/', reservationController_1.ReservationController.createReservation);
router.post('/:id/checkin', reservationController_1.ReservationController.checkIn);
router.post('/:id/checkout', reservationController_1.ReservationController.checkOut);
router.post('/:id/confirm', reservationController_1.ReservationController.confirmReservation);
router.post('/:id/cancel', (0, auth_1.authorize)(['admin']), reservationController_1.ReservationController.cancelReservation);
exports.default = router;
//# sourceMappingURL=reservations.js.map