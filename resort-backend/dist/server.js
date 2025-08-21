"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("@/routes/auth"));
const rooms_1 = __importDefault(require("@/routes/rooms"));
const reservations_1 = __importDefault(require("@/routes/reservations"));
const guests_1 = __importDefault(require("@/routes/guests"));
const dashboard_1 = __importDefault(require("@/routes/dashboard"));
const minibar_1 = __importDefault(require("@/routes/minibar"));
const payments_1 = __importDefault(require("@/routes/payments"));
const notifications_1 = __importDefault(require("@/routes/notifications"));
const upload_1 = __importDefault(require("@/routes/upload"));
const reports_1 = __importDefault(require("@/routes/reports"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Muitas requisições. Tente novamente em 15 minutos.'
    }
});
app.use('/api/', generalLimiter);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/rooms', rooms_1.default);
app.use('/api/reservations', reservations_1.default);
app.use('/api/guests', guests_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/minibar', minibar_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/reports', reports_1.default);
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map