"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reportService_1 = require("@/services/reportService");
const responses_1 = require("@/utils/responses");
const validators_1 = require("@/utils/validators");
const connection_1 = __importDefault(require("@/database/connection"));
class ReportController {
    static async generateReport(req, res) {
        try {
            const { error } = validators_1.generateReportSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const { report_type, format, start_date, end_date, filters, group_by, sort_by, sort_order, limit } = req.body;
            if (!reportService_1.ReportService.validateReportRequest(req.body)) {
                return responses_1.ResponseHandler.error(res, "Parâmetros de relatório inválidos", 400);
            }
            let reportData;
            switch (report_type) {
                case 'financial':
                    reportData = await reportService_1.ReportService.generateFinancialReport(req.body);
                    break;
                case 'occupancy':
                    reportData = await reportService_1.ReportService.generateOccupancyReport(req.body);
                    break;
                case 'minibar':
                    reportData = await reportService_1.ReportService.generateMinibarReport(req.body);
                    break;
                case 'notifications':
                    reportData = await reportService_1.ReportService.generateNotificationReport(req.body);
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Tipo de relatório não suportado", 400);
            }
            if (format === 'json') {
                return responses_1.ResponseHandler.success(res, reportData, "Relatório gerado com sucesso");
            }
            let exportResult;
            const reportName = `${report_type}_report`;
            switch (format) {
                case 'excel':
                    exportResult = await reportService_1.ReportService.exportToExcel(reportData, reportName);
                    break;
                case 'pdf':
                    exportResult = await reportService_1.ReportService.exportToPDF(reportData, reportName);
                    break;
                case 'csv':
                    exportResult = await reportService_1.ReportService.exportToCSV(reportData, reportName);
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Formato de exportação não suportado", 400);
            }
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;
        }
        catch (error) {
            console.error("Erro ao gerar relatório:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório", 500);
        }
    }
    static async generateFinancialReport(req, res) {
        try {
            const { format = 'json', start_date, end_date } = req.query;
            const request = {
                report_type: 'financial',
                format: format,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined
            };
            const reportData = await reportService_1.ReportService.generateFinancialReport(request);
            if (format === 'json') {
                return responses_1.ResponseHandler.success(res, reportData, "Relatório financeiro gerado com sucesso");
            }
            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await reportService_1.ReportService.exportToExcel(reportData, 'financial_report');
                    break;
                case 'pdf':
                    exportResult = await reportService_1.ReportService.exportToPDF(reportData, 'financial_report');
                    break;
                case 'csv':
                    exportResult = await reportService_1.ReportService.exportToCSV(reportData, 'financial_report');
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Formato não suportado", 400);
            }
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;
        }
        catch (error) {
            console.error("Erro ao gerar relatório financeiro:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório financeiro", 500);
        }
    }
    static async generateOccupancyReport(req, res) {
        try {
            console.log('🏨 Iniciando relatório de ocupação...');
            const { format = 'json', start_date, end_date } = req.query;
            console.log('📊 Parâmetros:', { format, start_date, end_date });
            try {
                const testQuery = await connection_1.default.query('SELECT COUNT(*) as count FROM rooms');
                console.log('✅ Conexão com banco OK. Total de quartos:', testQuery.rows[0].count);
                const reservationsQuery = await connection_1.default.query('SELECT COUNT(*) as count FROM reservations');
                console.log('✅ Reservas:', reservationsQuery.rows[0].count);
                const guestsQuery = await connection_1.default.query('SELECT COUNT(*) as count FROM guests');
                console.log('✅ Hóspedes:', guestsQuery.rows[0].count);
                const paymentsQuery = await connection_1.default.query('SELECT COUNT(*) as count FROM payments');
                console.log('✅ Pagamentos:', paymentsQuery.rows[0].count);
            }
            catch (dbError) {
                console.error('❌ Erro na conexão com banco:', dbError);
                return responses_1.ResponseHandler.error(res, "Erro na conexão com banco de dados", 500);
            }
            const request = {
                report_type: 'occupancy',
                format: format,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined
            };
            const reportData = await reportService_1.ReportService.generateOccupancyReport(request);
            if (format === 'json') {
                return responses_1.ResponseHandler.success(res, reportData, "Relatório de ocupação gerado com sucesso");
            }
            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await reportService_1.ReportService.exportToExcel(reportData, 'occupancy_report');
                    break;
                case 'pdf':
                    exportResult = await reportService_1.ReportService.exportToPDF(reportData, 'occupancy_report');
                    break;
                case 'csv':
                    exportResult = await reportService_1.ReportService.exportToCSV(reportData, 'occupancy_report');
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Formato não suportado", 400);
            }
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;
        }
        catch (error) {
            console.error("Erro ao gerar relatório de ocupação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório de ocupação", 500);
        }
    }
    static async generateMinibarReport(req, res) {
        try {
            const { format = 'json', start_date, end_date } = req.query;
            const request = {
                report_type: 'minibar',
                format: format,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined
            };
            const reportData = await reportService_1.ReportService.generateMinibarReport(request);
            if (format === 'json') {
                return responses_1.ResponseHandler.success(res, reportData, "Relatório de minibar gerado com sucesso");
            }
            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await reportService_1.ReportService.exportToExcel(reportData, 'minibar_report');
                    break;
                case 'pdf':
                    exportResult = await reportService_1.ReportService.exportToPDF(reportData, 'minibar_report');
                    break;
                case 'csv':
                    exportResult = await reportService_1.ReportService.exportToCSV(reportData, 'minibar_report');
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Formato não suportado", 400);
            }
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;
        }
        catch (error) {
            console.error("Erro ao gerar relatório de minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório de minibar", 500);
        }
    }
    static async generateNotificationReport(req, res) {
        try {
            const { format = 'json', start_date, end_date } = req.query;
            const request = {
                report_type: 'notifications',
                format: format,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined
            };
            const reportData = await reportService_1.ReportService.generateNotificationReport(request);
            if (format === 'json') {
                return responses_1.ResponseHandler.success(res, reportData, "Relatório de notificações gerado com sucesso");
            }
            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await reportService_1.ReportService.exportToExcel(reportData, 'notification_report');
                    break;
                case 'pdf':
                    exportResult = await reportService_1.ReportService.exportToPDF(reportData, 'notification_report');
                    break;
                case 'csv':
                    exportResult = await reportService_1.ReportService.exportToCSV(reportData, 'notification_report');
                    break;
                default:
                    return responses_1.ResponseHandler.error(res, "Formato não suportado", 400);
            }
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;
        }
        catch (error) {
            console.error("Erro ao gerar relatório de notificações:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório de notificações", 500);
        }
    }
    static async generateCustomReport(req, res) {
        try {
            const { error } = validators_1.customReportSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const { report_name, query, parameters } = req.body;
            if (!this.isValidSQLQuery(query)) {
                return responses_1.ResponseHandler.error(res, "Query SQL inválida ou não permitida", 400);
            }
            const result = await connection_1.default.query(query, parameters || []);
            const customReport = {
                report_name,
                generated_at: new Date(),
                data: result.rows,
                metadata: {
                    filters_applied: parameters || {},
                    total_records: result.rows.length,
                    execution_time: 0
                }
            };
            return responses_1.ResponseHandler.success(res, customReport, "Relatório personalizado gerado com sucesso");
        }
        catch (error) {
            console.error("Erro ao gerar relatório personalizado:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório personalizado", 500);
        }
    }
    static async getAvailableReportTypes(req, res) {
        try {
            const reportTypes = reportService_1.ReportService.getAvailableReportTypes();
            return responses_1.ResponseHandler.success(res, reportTypes, "Tipos de relatório obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter tipos de relatório:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter tipos de relatório", 500);
        }
    }
    static async getAvailableExportFormats(req, res) {
        try {
            const exportFormats = reportService_1.ReportService.getAvailableExportFormats();
            return responses_1.ResponseHandler.success(res, exportFormats, "Formatos de exportação obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter formatos de exportação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter formatos de exportação", 500);
        }
    }
    static async getReportStats(req, res) {
        try {
            const stats = {
                total_reports_generated: 0,
                available_types: reportService_1.ReportService.getAvailableReportTypes(),
                available_formats: reportService_1.ReportService.getAvailableExportFormats(),
                last_generated: new Date(),
                system_info: {
                    version: "1.0.0",
                    database_connected: true,
                    export_engines: ["ExcelJS", "PDFKit"]
                }
            };
            return responses_1.ResponseHandler.success(res, stats, "Estatísticas de relatórios obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter estatísticas de relatórios:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter estatísticas de relatórios", 500);
        }
    }
    static isValidSQLQuery(query) {
        const dangerousKeywords = [
            'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE',
            'EXEC', 'EXECUTE', 'EXECUTE IMMEDIATE', 'EXECUTE STATEMENT',
            'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
            'BEGIN', 'END', 'TRANSACTION', 'LOCK', 'UNLOCK'
        ];
        const upperQuery = query.toUpperCase();
        for (const keyword of dangerousKeywords) {
            if (upperQuery.includes(keyword)) {
                return false;
            }
        }
        if (!upperQuery.trim().startsWith('SELECT')) {
            return false;
        }
        if ((query.match(/;/g) || []).length > 1) {
            return false;
        }
        return true;
    }
    static async testDatabase(req, res) {
        try {
            console.log('🧪 Iniciando teste de banco de dados...');
            const test1 = await connection_1.default.query('SELECT 1 as test');
            console.log('✅ Teste 1 - Conexão básica:', test1.rows[0]);
            const test2 = await connection_1.default.query('SELECT COUNT(*) as count FROM rooms');
            console.log('✅ Teste 2 - Tabela rooms:', test2.rows[0]);
            const test3 = await connection_1.default.query('SELECT COUNT(*) as count FROM reservations');
            console.log('✅ Teste 3 - Tabela reservations:', test3.rows[0]);
            const test4 = await connection_1.default.query('SELECT COUNT(*) as count FROM guests');
            console.log('✅ Teste 4 - Tabela guests:', test4.rows[0]);
            const test5 = await connection_1.default.query('SELECT COUNT(*) as count FROM payments');
            console.log('✅ Teste 5 - Tabela payments:', test5.rows[0]);
            const test6 = await connection_1.default.query('SELECT COUNT(*) as count FROM minibar_consumption');
            console.log('✅ Teste 6 - Tabela minibar_consumption:', test6.rows[0]);
            return responses_1.ResponseHandler.success(res, {
                connection: 'OK',
                rooms: test2.rows[0].count,
                reservations: test3.rows[0].count,
                guests: test4.rows[0].count,
                payments: test5.rows[0].count,
                minibar_consumption: test6.rows[0].count
            }, "Teste de banco concluído com sucesso");
        }
        catch (error) {
            console.error('❌ Erro no teste de banco:', error);
            return responses_1.ResponseHandler.error(res, "Erro no teste de banco de dados", 500);
        }
    }
    static async createTestData(req, res) {
        try {
            console.log('🧪 Criando dados de teste...');
            const guest1 = await connection_1.default.query(`
                INSERT INTO guests (name, email, phone, document, nationality, language_preference)
                VALUES ('João Silva', 'joao@teste.com', '(11) 99999-9999', '123.456.789-00', 'Brasileiro', 'pt')
                RETURNING id
            `);
            console.log('✅ Hóspede 1 criado:', guest1.rows[0].id);
            const guest2 = await connection_1.default.query(`
                INSERT INTO guests (name, email, phone, document, nationality, language_preference)
                VALUES ('Maria Santos', 'maria@teste.com', '(11) 88888-8888', '987.654.321-00', 'Brasileira', 'pt')
                RETURNING id
            `);
            console.log('✅ Hóspede 2 criado:', guest2.rows[0].id);
            const room1 = await connection_1.default.query(`
                INSERT INTO rooms (number, type, capacity, price_per_night, amenities, status, floor, description)
                VALUES ('101', 'Standard', 2, 150.00, ARRAY['WiFi', 'TV', 'Ar condicionado'], 'available', 1, 'Quarto padrão')
                RETURNING id
            `);
            console.log('✅ Quarto 1 criado:', room1.rows[0].id);
            const room2 = await connection_1.default.query(`
                INSERT INTO rooms (number, type, capacity, price_per_night, amenities, status, floor, description)
                VALUES ('201', 'Luxo', 3, 300.00, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Vista para o mar'], 'available', 2, 'Quarto de luxo')
                RETURNING id
            `);
            console.log('✅ Quarto 2 criado:', room2.rows[0].id);
            const reservation1 = await connection_1.default.query(`
                INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_guests, total_amount, status, payment_status, created_by)
                VALUES ($1, $2, '2024-01-15', '2024-01-17', 2, 300.00, 'confirmed', 'paid', 2)
                RETURNING id
            `, [guest1.rows[0].id, room1.rows[0].id]);
            console.log('✅ Reserva 1 criada:', reservation1.rows[0].id);
            const reservation2 = await connection_1.default.query(`
                INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_guests, total_amount, status, payment_status, created_by)
                VALUES ($1, $2, '2024-01-20', '2024-01-22', 3, 600.00, 'checked_in', 'paid', 2)
                RETURNING id
            `, [guest2.rows[0].id, room2.rows[0].id]);
            console.log('✅ Reserva 2 criada:', reservation2.rows[0].id);
            const payment1 = await connection_1.default.query(`
                INSERT INTO payments (reservation_id, amount, payment_method, status, processed_by)
                VALUES ($1, 300.00, 'credit_card', 'paid', 2)
                RETURNING id
            `, [reservation1.rows[0].id]);
            console.log('✅ Pagamento 1 criado:', payment1.rows[0].id);
            const payment2 = await connection_1.default.query(`
                INSERT INTO payments (reservation_id, amount, payment_method, status, processed_by)
                VALUES ($1, 600.00, 'pix', 'paid', 2)
                RETURNING id
            `, [reservation2.rows[0].id]);
            console.log('✅ Pagamento 2 criado:', payment2.rows[0].id);
            return responses_1.ResponseHandler.success(res, {
                guests_created: 2,
                rooms_created: 2,
                reservations_created: 2,
                payments_created: 2
            }, "Dados de teste criados com sucesso");
        }
        catch (error) {
            console.error('❌ Erro ao criar dados de teste:', error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar dados de teste", 500);
        }
    }
    static async getQuickDashboardReport(req, res) {
        try {
            console.log('🚀 Iniciando relatório rápido...');
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            console.log('📅 Datas:', { today, startOfMonth });
            const financialReport = await reportService_1.ReportService.generateFinancialReport({
                report_type: 'financial',
                format: 'json',
                start_date: startOfMonth,
                end_date: today
            });
            const occupancyReport = await reportService_1.ReportService.generateOccupancyReport({
                report_type: 'occupancy',
                format: 'json',
                start_date: startOfMonth,
                end_date: today
            });
            const minibarReport = await reportService_1.ReportService.generateMinibarReport({
                report_type: 'minibar',
                format: 'json',
                start_date: startOfMonth,
                end_date: today
            });
            const quickReport = {
                period: {
                    start_date: startOfMonth,
                    end_date: today
                },
                financial_summary: financialReport.summary,
                occupancy_summary: occupancyReport.summary,
                minibar_summary: minibarReport.summary,
                generated_at: new Date()
            };
            return responses_1.ResponseHandler.success(res, quickReport, "Relatório rápido gerado com sucesso");
        }
        catch (error) {
            console.error("Erro ao gerar relatório rápido:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao gerar relatório rápido", 500);
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map