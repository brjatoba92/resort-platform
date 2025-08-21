import { Router } from "express";
import { RoomController } from "@/controllers/roomController";
import { authenticate, authorize } from "@/middleware/auth";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas que funcionarios podem acessar
router.get('/', RoomController.getAllRooms);
router.get('/availability', RoomController.checkAvailability);
router.get('/:id', RoomController.getRoomById);

// Rotas apenas para admins
router.post('/', authorize(['admin']), RoomController.createRoom);
router.put('/:id', authorize(['admin']), RoomController.updateRoom);
router.delete('/:id', authorize(['admin']), RoomController.deleteRoom);

export default router;