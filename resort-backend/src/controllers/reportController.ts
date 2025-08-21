import { Request, Response } from "express";
import { ReportService } from "@/services/reportService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import { 
    generateReportSchema, 
    customReportSchema, 
    reportScheduleSchema 
} from "@/utils/validators";
import pool from "@/database/connection";

export class ReportController {
    // ========================================
    // GERAÇÃO DE RELATÓRIOS
    // ========================================

    // Gerar relatório
    static async generateReport(req: AuthRequest, res: Response) {
        try {
            // Validar dados da requisição
            const { error } = generateReportSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const { report_type, format, start_date, end_date, filters, group_by, sort_by, sort_order, limit } = req.body;

            // Validar parâmetros
            if (!ReportService.validateReportRequest(req.body)) {
                return ResponseHandler.error(res, "Parâmetros de relatório inválidos", 400);
            }

            let reportData: any;

            // Gerar relatório baseado no tipo
            switch (report_type) {
                case 'financial':
                    reportData = await ReportService.generateFinancialReport(req.body);
                    break;
                case 'occupancy':
                    reportData = await ReportService.generateOccupancyReport(req.body);
                    break;
                case 'minibar':
                    reportData = await ReportService.generateMinibarReport(req.body);
                    break;
                case 'notifications':
                    reportData = await ReportService.generateNotificationReport(req.body);
                    break;
                default:
                    return ResponseHandler.error(res, "Tipo de relatório não suportado", 400);
            }

            // Se formato for JSON, retornar diretamente
            if (format === 'json') {
                return ResponseHandler.success(res, reportData, "Relatório gerado com sucesso");
            }

            // Exportar para outros formatos
            let exportResult;
            const reportName = `${report_type}_report`;

            switch (format) {
                case 'excel':
                    exportResult = await ReportService.exportToExcel(reportData, reportName);
                    break;
                case 'pdf':
                    exportResult = await ReportService.exportToPDF(reportData, reportName);
                    break;
                case 'csv':
                    exportResult = await ReportService.exportToCSV(reportData, reportName);
                    break;
                default:
                    return ResponseHandler.error(res, "Formato de exportação não suportado", 400);
            }

            // Configurar headers para download
            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());

            // Enviar arquivo
            res.send(exportResult.content);
            return;

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório", 500);
        }
    }

    // ========================================
    // RELATÓRIOS ESPECÍFICOS
    // ========================================

    // Relatório financeiro
    static async generateFinancialReport(req: Request, res: Response) {
        try {
            const { format = 'json', start_date, end_date } = req.query;

            const request = {
                report_type: 'financial' as const,
                format: format as any,
                start_date: start_date ? new Date(start_date as string) : undefined,
                end_date: end_date ? new Date(end_date as string) : undefined
            };

            const reportData = await ReportService.generateFinancialReport(request);

            if (format === 'json') {
                return ResponseHandler.success(res, reportData, "Relatório financeiro gerado com sucesso");
            }

            // Exportar para outros formatos
            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await ReportService.exportToExcel(reportData, 'financial_report');
                    break;
                case 'pdf':
                    exportResult = await ReportService.exportToPDF(reportData, 'financial_report');
                    break;
                case 'csv':
                    exportResult = await ReportService.exportToCSV(reportData, 'financial_report');
                    break;
                default:
                    return ResponseHandler.error(res, "Formato não suportado", 400);
            }

            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;

        } catch (error) {
            console.error("Erro ao gerar relatório financeiro:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório financeiro", 500);
        }
    }

    // Relatório de ocupação
    static async generateOccupancyReport(req: Request, res: Response) {
        try {
            console.log('🏨 Iniciando relatório de ocupação...');
            const { format = 'json', start_date, end_date } = req.query;
            console.log('📊 Parâmetros:', { format, start_date, end_date });

            // Teste simples de conexão com o banco
            try {
                const testQuery = await pool.query('SELECT COUNT(*) as count FROM rooms');
                console.log('✅ Conexão com banco OK. Total de quartos:', testQuery.rows[0].count);
                
                // Teste das tabelas principais
                const reservationsQuery = await pool.query('SELECT COUNT(*) as count FROM reservations');
                console.log('✅ Reservas:', reservationsQuery.rows[0].count);
                
                const guestsQuery = await pool.query('SELECT COUNT(*) as count FROM guests');
                console.log('✅ Hóspedes:', guestsQuery.rows[0].count);
                
                const paymentsQuery = await pool.query('SELECT COUNT(*) as count FROM payments');
                console.log('✅ Pagamentos:', paymentsQuery.rows[0].count);
                
            } catch (dbError) {
                console.error('❌ Erro na conexão com banco:', dbError);
                return ResponseHandler.error(res, "Erro na conexão com banco de dados", 500);
            }

            const request = {
                report_type: 'occupancy' as const,
                format: format as any,
                start_date: start_date ? new Date(start_date as string) : undefined,
                end_date: end_date ? new Date(end_date as string) : undefined
            };

            const reportData = await ReportService.generateOccupancyReport(request);

            if (format === 'json') {
                return ResponseHandler.success(res, reportData, "Relatório de ocupação gerado com sucesso");
            }

            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await ReportService.exportToExcel(reportData, 'occupancy_report');
                    break;
                case 'pdf':
                    exportResult = await ReportService.exportToPDF(reportData, 'occupancy_report');
                    break;
                case 'csv':
                    exportResult = await ReportService.exportToCSV(reportData, 'occupancy_report');
                    break;
                default:
                    return ResponseHandler.error(res, "Formato não suportado", 400);
            }

            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;

        } catch (error) {
            console.error("Erro ao gerar relatório de ocupação:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório de ocupação", 500);
        }
    }

    // Relatório de minibar
    static async generateMinibarReport(req: Request, res: Response) {
        try {
            const { format = 'json', start_date, end_date } = req.query;

            const request = {
                report_type: 'minibar' as const,
                format: format as any,
                start_date: start_date ? new Date(start_date as string) : undefined,
                end_date: end_date ? new Date(end_date as string) : undefined
            };

            const reportData = await ReportService.generateMinibarReport(request);

            if (format === 'json') {
                return ResponseHandler.success(res, reportData, "Relatório de minibar gerado com sucesso");
            }

            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await ReportService.exportToExcel(reportData, 'minibar_report');
                    break;
                case 'pdf':
                    exportResult = await ReportService.exportToPDF(reportData, 'minibar_report');
                    break;
                case 'csv':
                    exportResult = await ReportService.exportToCSV(reportData, 'minibar_report');
                    break;
                default:
                    return ResponseHandler.error(res, "Formato não suportado", 400);
            }

            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;

        } catch (error) {
            console.error("Erro ao gerar relatório de minibar:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório de minibar", 500);
        }
    }

    // Relatório de notificações
    static async generateNotificationReport(req: Request, res: Response) {
        try {
            const { format = 'json', start_date, end_date } = req.query;

            const request = {
                report_type: 'notifications' as const,
                format: format as any,
                start_date: start_date ? new Date(start_date as string) : undefined,
                end_date: end_date ? new Date(end_date as string) : undefined
            };

            const reportData = await ReportService.generateNotificationReport(request);

            if (format === 'json') {
                return ResponseHandler.success(res, reportData, "Relatório de notificações gerado com sucesso");
            }

            let exportResult;
            switch (format) {
                case 'excel':
                    exportResult = await ReportService.exportToExcel(reportData, 'notification_report');
                    break;
                case 'pdf':
                    exportResult = await ReportService.exportToPDF(reportData, 'notification_report');
                    break;
                case 'csv':
                    exportResult = await ReportService.exportToCSV(reportData, 'notification_report');
                    break;
                default:
                    return ResponseHandler.error(res, "Formato não suportado", 400);
            }

            res.setHeader('Content-Type', exportResult.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
            res.setHeader('Content-Length', exportResult.size.toString());
            res.send(exportResult.content);
            return;

        } catch (error) {
            console.error("Erro ao gerar relatório de notificações:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório de notificações", 500);
        }
    }

    // ========================================
    // RELATÓRIOS PERSONALIZADOS
    // ========================================

    // Relatório personalizado
    static async generateCustomReport(req: AuthRequest, res: Response) {
        try {
            const { error } = customReportSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const { report_name, query, parameters } = req.body;

            // Validar query SQL (implementar validação de segurança)
            if (!this.isValidSQLQuery(query)) {
                return ResponseHandler.error(res, "Query SQL inválida ou não permitida", 400);
            }

            // Executar query personalizada
            const result = await pool.query(query, parameters || []);
            
            const customReport = {
                report_name,
                generated_at: new Date(),
                data: result.rows,
                metadata: {
                    filters_applied: parameters || {},
                    total_records: result.rows.length,
                    execution_time: 0 // Implementar medição de tempo se necessário
                }
            };

            return ResponseHandler.success(res, customReport, "Relatório personalizado gerado com sucesso");

        } catch (error) {
            console.error("Erro ao gerar relatório personalizado:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório personalizado", 500);
        }
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter tipos de relatório disponíveis
    static async getAvailableReportTypes(req: Request, res: Response) {
        try {
            const reportTypes = ReportService.getAvailableReportTypes();
            return ResponseHandler.success(res, reportTypes, "Tipos de relatório obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter tipos de relatório:", error);
            return ResponseHandler.error(res, "Erro ao obter tipos de relatório", 500);
        }
    }

    // Obter formatos de exportação disponíveis
    static async getAvailableExportFormats(req: Request, res: Response) {
        try {
            const exportFormats = ReportService.getAvailableExportFormats();
            return ResponseHandler.success(res, exportFormats, "Formatos de exportação obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter formatos de exportação:", error);
            return ResponseHandler.error(res, "Erro ao obter formatos de exportação", 500);
        }
    }

    // Obter estatísticas de relatórios
    static async getReportStats(req: Request, res: Response) {
        try {
            const stats = {
                total_reports_generated: 0, // Implementar contador se necessário
                available_types: ReportService.getAvailableReportTypes(),
                available_formats: ReportService.getAvailableExportFormats(),
                last_generated: new Date(),
                system_info: {
                    version: "1.0.0",
                    database_connected: true,
                    export_engines: ["ExcelJS", "PDFKit"]
                }
            };

            return ResponseHandler.success(res, stats, "Estatísticas de relatórios obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter estatísticas de relatórios:", error);
            return ResponseHandler.error(res, "Erro ao obter estatísticas de relatórios", 500);
        }
    }

    // ========================================
    // VALIDAÇÕES DE SEGURANÇA
    // ========================================

    // Validar query SQL (implementação básica de segurança)
    private static isValidSQLQuery(query: string): boolean {
        // Lista de palavras-chave perigosas
        const dangerousKeywords = [
            'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE',
            'EXEC', 'EXECUTE', 'EXECUTE IMMEDIATE', 'EXECUTE STATEMENT',
            'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
            'BEGIN', 'END', 'TRANSACTION', 'LOCK', 'UNLOCK'
        ];

        const upperQuery = query.toUpperCase();

        // Verificar se contém palavras-chave perigosas
        for (const keyword of dangerousKeywords) {
            if (upperQuery.includes(keyword)) {
                return false;
            }
        }

        // Verificar se começa com SELECT
        if (!upperQuery.trim().startsWith('SELECT')) {
            return false;
        }

        // Verificar se não contém múltiplas queries (ponto e vírgula)
        if ((query.match(/;/g) || []).length > 1) {
            return false;
        }

        return true;
    }

    // ========================================
    // ENDPOINT DE TESTE
    // ========================================

    // Endpoint de teste para verificar estrutura do banco
    static async testDatabase(req: Request, res: Response) {
        try {
            console.log('🧪 Iniciando teste de banco de dados...');
            
            // Teste 1: Conexão básica
            const test1 = await pool.query('SELECT 1 as test');
            console.log('✅ Teste 1 - Conexão básica:', test1.rows[0]);
            
            // Teste 2: Tabela rooms
            const test2 = await pool.query('SELECT COUNT(*) as count FROM rooms');
            console.log('✅ Teste 2 - Tabela rooms:', test2.rows[0]);
            
            // Teste 3: Tabela reservations
            const test3 = await pool.query('SELECT COUNT(*) as count FROM reservations');
            console.log('✅ Teste 3 - Tabela reservations:', test3.rows[0]);
            
            // Teste 4: Tabela guests
            const test4 = await pool.query('SELECT COUNT(*) as count FROM guests');
            console.log('✅ Teste 4 - Tabela guests:', test4.rows[0]);
            
            // Teste 5: Tabela payments
            const test5 = await pool.query('SELECT COUNT(*) as count FROM payments');
            console.log('✅ Teste 5 - Tabela payments:', test5.rows[0]);
            
            // Teste 6: Tabela minibar_consumption
            const test6 = await pool.query('SELECT COUNT(*) as count FROM minibar_consumption');
            console.log('✅ Teste 6 - Tabela minibar_consumption:', test6.rows[0]);
            
            return ResponseHandler.success(res, {
                connection: 'OK',
                rooms: test2.rows[0].count,
                reservations: test3.rows[0].count,
                guests: test4.rows[0].count,
                payments: test5.rows[0].count,
                minibar_consumption: test6.rows[0].count
            }, "Teste de banco concluído com sucesso");
        } catch (error) {
            console.error('❌ Erro no teste de banco:', error);
            return ResponseHandler.error(res, "Erro no teste de banco de dados", 500);
        }
    }

    // Endpoint para criar dados de teste
    static async createTestData(req: Request, res: Response) {
        try {
            console.log('🧪 Criando dados de teste...');
            
            // Criar hóspedes
            const guest1 = await pool.query(`
                INSERT INTO guests (name, email, phone, document, nationality, language_preference)
                VALUES ('João Silva', 'joao@teste.com', '(11) 99999-9999', '123.456.789-00', 'Brasileiro', 'pt')
                RETURNING id
            `);
            console.log('✅ Hóspede 1 criado:', guest1.rows[0].id);
            
            const guest2 = await pool.query(`
                INSERT INTO guests (name, email, phone, document, nationality, language_preference)
                VALUES ('Maria Santos', 'maria@teste.com', '(11) 88888-8888', '987.654.321-00', 'Brasileira', 'pt')
                RETURNING id
            `);
            console.log('✅ Hóspede 2 criado:', guest2.rows[0].id);
            
            // Criar quartos
            const room1 = await pool.query(`
                INSERT INTO rooms (number, type, capacity, price_per_night, amenities, status, floor, description)
                VALUES ('101', 'Standard', 2, 150.00, ARRAY['WiFi', 'TV', 'Ar condicionado'], 'available', 1, 'Quarto padrão')
                RETURNING id
            `);
            console.log('✅ Quarto 1 criado:', room1.rows[0].id);
            
            const room2 = await pool.query(`
                INSERT INTO rooms (number, type, capacity, price_per_night, amenities, status, floor, description)
                VALUES ('201', 'Luxo', 3, 300.00, ARRAY['WiFi', 'TV', 'Ar condicionado', 'Vista para o mar'], 'available', 2, 'Quarto de luxo')
                RETURNING id
            `);
            console.log('✅ Quarto 2 criado:', room2.rows[0].id);
            
            // Criar reservas
            const reservation1 = await pool.query(`
                INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_guests, total_amount, status, payment_status, created_by)
                VALUES ($1, $2, '2024-01-15', '2024-01-17', 2, 300.00, 'confirmed', 'paid', 2)
                RETURNING id
            `, [guest1.rows[0].id, room1.rows[0].id]);
            console.log('✅ Reserva 1 criada:', reservation1.rows[0].id);
            
            const reservation2 = await pool.query(`
                INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_guests, total_amount, status, payment_status, created_by)
                VALUES ($1, $2, '2024-01-20', '2024-01-22', 3, 600.00, 'checked_in', 'paid', 2)
                RETURNING id
            `, [guest2.rows[0].id, room2.rows[0].id]);
            console.log('✅ Reserva 2 criada:', reservation2.rows[0].id);
            
            // Criar pagamentos
            const payment1 = await pool.query(`
                INSERT INTO payments (reservation_id, amount, payment_method, status, processed_by)
                VALUES ($1, 300.00, 'credit_card', 'paid', 2)
                RETURNING id
            `, [reservation1.rows[0].id]);
            console.log('✅ Pagamento 1 criado:', payment1.rows[0].id);
            
            const payment2 = await pool.query(`
                INSERT INTO payments (reservation_id, amount, payment_method, status, processed_by)
                VALUES ($1, 600.00, 'pix', 'paid', 2)
                RETURNING id
            `, [reservation2.rows[0].id]);
            console.log('✅ Pagamento 2 criado:', payment2.rows[0].id);
            
            return ResponseHandler.success(res, {
                guests_created: 2,
                rooms_created: 2,
                reservations_created: 2,
                payments_created: 2
            }, "Dados de teste criados com sucesso");
            
        } catch (error) {
            console.error('❌ Erro ao criar dados de teste:', error);
            return ResponseHandler.error(res, "Erro ao criar dados de teste", 500);
        }
    }

    // ========================================
    // RELATÓRIOS RÁPIDOS
    // ========================================

    // Relatório rápido de dashboard
    static async getQuickDashboardReport(req: Request, res: Response) {
        try {
            console.log('🚀 Iniciando relatório rápido...');
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            console.log('📅 Datas:', { today, startOfMonth });

            // Gerar relatórios rápidos
            const financialReport = await ReportService.generateFinancialReport({
                report_type: 'financial',
                format: 'json',
                start_date: startOfMonth,
                end_date: today
            });

            const occupancyReport = await ReportService.generateOccupancyReport({
                report_type: 'occupancy',
                format: 'json',
                start_date: startOfMonth,
                end_date: today
            });

            const minibarReport = await ReportService.generateMinibarReport({
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

            return ResponseHandler.success(res, quickReport, "Relatório rápido gerado com sucesso");

        } catch (error) {
            console.error("Erro ao gerar relatório rápido:", error);
            return ResponseHandler.error(res, "Erro ao gerar relatório rápido", 500);
        }
    }
}
