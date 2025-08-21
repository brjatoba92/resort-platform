"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static success(res, data, message, statusCode = 200) {
        const response = {
            success: true,
            data,
            ...(message && { message })
        };
        return res.status(statusCode).json(response);
    }
    static error(res, error, statusCode = 400) {
        const response = {
            success: false,
            error
        };
        return res.status(statusCode).json(response);
    }
    static created(res, data, message) {
        return this.success(res, data, message, 201);
    }
    static noContent(res) {
        return res.status(204).send();
    }
}
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=responses.js.map