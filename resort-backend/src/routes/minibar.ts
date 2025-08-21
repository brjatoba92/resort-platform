import { Router } from "express";
import { MinibarController } from "@/controllers/minibarController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// ========================================
// ROTAS DE ITENS DO MINIBAR
// ========================================

// Listar todos os itens
router.get("/items", authenticate, MinibarController.getAllItems);

// Obter item por ID
router.get("/items/:id", authenticate, MinibarController.getItemById);

// Criar novo item (apenas admin)
router.post("/items", authenticate, MinibarController.createItem);

// Atualizar item (apenas admin)
router.put("/items/:id", authenticate, MinibarController.updateItem);

// Deletar item (apenas admin)
router.delete("/items/:id", authenticate, MinibarController.deleteItem);

// Obter itens por categoria
router.get("/items/category/:category", authenticate, MinibarController.getItemsByCategory);

// Obter categorias disponíveis
router.get("/categories", authenticate, MinibarController.getCategories);

// ========================================
// ROTAS DE CONSUMO DO MINIBAR
// ========================================

// Registrar consumo
router.post("/consumption", authenticate, MinibarController.recordConsumption);

// Obter consumo por reserva
router.get("/consumption/reservation/:reservationId", authenticate, MinibarController.getConsumptionByReservation);

// Obter consumo por período
router.get("/consumption/period", authenticate, MinibarController.getConsumptionByPeriod);

// Obter total de consumo por reserva
router.get("/consumption/total/:reservationId", authenticate, MinibarController.getTotalConsumptionByReservation);

// Obter estatísticas de consumo
router.get("/consumption/stats", authenticate, MinibarController.getConsumptionStats);

// Obter consumo por item
router.get("/consumption/item/:itemId", authenticate, MinibarController.getConsumptionByItem);

export default router;
