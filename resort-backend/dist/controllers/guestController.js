"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestController = void 0;
const guestService_1 = require("@/services/guestService");
const responses_1 = require("@/utils/responses");
class GuestController {
    static async getAllGuests(req, res) {
        try {
            const filters = {
                search: req.query.search,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
            };
            const result = await guestService_1.GuestService.getAllGuests(filters);
            return responses_1.ResponseHandler.success(res, result, 'Hóspedes listados com sucesso');
        }
        catch (error) {
            console.error('Erro ao listar hóspedes:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async getGuestById(req, res) {
        try {
            const guestId = req.params.id;
            if (!guestId) {
                return responses_1.ResponseHandler.error(res, 'ID do hóspede é obrigatório', 400);
            }
            const guest = await guestService_1.GuestService.findGuestById(parseInt(guestId));
            if (!guest) {
                return responses_1.ResponseHandler.error(res, 'Hóspede não encontrado', 404);
            }
            return responses_1.ResponseHandler.success(res, guest, 'Hóspede encontrado com sucesso');
        }
        catch (error) {
            console.error('Erro ao obter hóspede:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
}
exports.GuestController = GuestController;
//# sourceMappingURL=guestController.js.map