import { Router } from "express";
import { DashboardController } from "@/controllers/dashboardController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get("/overview", DashboardController.getDashboardOverview);
router.get("/weather", DashboardController.getWeatherData);
router.get("/occupancy-charts", DashboardController.getOccupancyGraphs);

export default router;