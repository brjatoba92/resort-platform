import { Router } from "express";
import { GuestController } from "@/controllers/guestController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get('/', GuestController.getAllGuests);
router.get('/:id', GuestController.getGuestById);

export default router;