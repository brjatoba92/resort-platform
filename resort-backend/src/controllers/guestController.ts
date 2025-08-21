import { Response } from "express";
import { GuestService } from "@/services/guestService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";

export class GuestController {
    // Listar hóspedes
    static async getAllGuests(req: AuthRequest, res: Response) {
        try {
            const filters = {
                search: req.query.search as string,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            };

            const result = await GuestService.getAllGuests(filters);
            return ResponseHandler.success(res, result, 'Hóspedes listados com sucesso');
        } catch (error) {
            console.error('Erro ao listar hóspedes:', error);
            return ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }

    // Obter hóspede por ID
    static async getGuestById(req: AuthRequest, res: Response) {
        try {
            const guestId = req.params.id;
            if (!guestId) {
                return ResponseHandler.error(res, 'ID do hóspede é obrigatório', 400);
            }

            const guest = await GuestService.findGuestById(parseInt(guestId));
            if (!guest) {
                return ResponseHandler.error(res, 'Hóspede não encontrado', 404);
            }
            return ResponseHandler.success(res, guest, 'Hóspede encontrado com sucesso');
        } catch (error) {
            console.error('Erro ao obter hóspede:', error);
            return ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
}