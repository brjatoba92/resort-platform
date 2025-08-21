"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("@/services/dashboardService");
const responses_1 = require("@/utils/responses");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DashboardController {
    static async getDashboardOverview(req, res) {
        try {
            const overview = await dashboardService_1.DashboardService.getDashboardOverview();
            return responses_1.ResponseHandler.success(res, overview, "Visão geral do dashboard");
        }
        catch (error) {
            console.error("Erro ao obter visão geral do dashboard:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter visão geral do dashboard", 500);
        }
    }
    static async getWeatherData(req, res) {
        try {
            const API_KEY = process.env.WEATHER_API_KEY;
            const CITY = 'Maceió';
            if (!API_KEY) {
                return responses_1.ResponseHandler.error(res, "Chave API de clima não definida", 503);
            }
            const weatherResponse = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=pt_br`);
            const weatherData = {
                temperature: Math.round(weatherResponse.data.main.temp),
                feels_like: Math.round(weatherResponse.data.main.feels_like),
                humidity: weatherResponse.data.main.humidity,
                description: weatherResponse.data.weather[0].description,
                icon: weatherResponse.data.weather[0].icon,
                wind_speed: weatherResponse.data.wind.speed,
                location: weatherResponse.data.name,
                last_update: new Date().toISOString()
            };
            return responses_1.ResponseHandler.success(res, weatherData, "Dados meteorologicos obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter dados meteorologicos:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter dados meteorologicos", 503);
        }
    }
    static async getOccupancyGraphs(req, res) {
        try {
            const occupancyData = await dashboardService_1.DashboardService.getOccupancyByMonth();
            return responses_1.ResponseHandler.success(res, occupancyData, "Dados de ocupação obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter dados de ocupação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter dados de ocupação", 500);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboardController.js.map