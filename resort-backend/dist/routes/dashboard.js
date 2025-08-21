"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("@/controllers/dashboardController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/overview", dashboardController_1.DashboardController.getDashboardOverview);
router.get("/weather", dashboardController_1.DashboardController.getWeatherData);
router.get("/occupancy-charts", dashboardController_1.DashboardController.getOccupancyGraphs);
exports.default = router;
//# sourceMappingURL=dashboard.js.map