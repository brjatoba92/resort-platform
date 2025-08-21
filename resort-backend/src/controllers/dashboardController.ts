import { Response } from "express";
import { DashboardService } from "@/services/dashboardService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export class DashboardController {
    // Obter visão geral d dashboard
    static async getDashboardOverview(req: AuthRequest, res: Response) {
        try {
            const overview = await DashboardService.getDashboardOverview();
            return ResponseHandler.success(res, overview, "Visão geral do dashboard");
        } catch (error) {
            console.error("Erro ao obter visão geral do dashboard:", error);
            return ResponseHandler.error(res, "Erro ao obter visão geral do dashboard", 500);
        }
    }

    // Obter dados meteorologicos
    static async getWeatherData(req: AuthRequest, res: Response) {
        try {
            const API_KEY = process.env.WEATHER_API_KEY;
            const CITY = 'Maceió'; // ou usar latitude e longitude do resort

            if (!API_KEY) {
                return ResponseHandler.error(res, "Chave API de clima não definida", 503);
            }

            const weatherResponse = await axios.get(
                 `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=pt_br`
            );

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

            return ResponseHandler.success(res, weatherData, "Dados meteorologicos obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter dados meteorologicos:", error);
            return ResponseHandler.error(res, "Erro ao obter dados meteorologicos", 503);
        }
    }

    // oBTER GRAFICOS DE OCUPAÇÃO
    static async getOccupancyGraphs(req: AuthRequest, res: Response) {
        try {
            const occupancyData = await DashboardService.getOccupancyByMonth();
            return ResponseHandler.success(res, occupancyData, "Dados de ocupação obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter dados de ocupação:", error);
            return ResponseHandler.error(res, "Erro ao obter dados de ocupação", 500);
        }
    }
}