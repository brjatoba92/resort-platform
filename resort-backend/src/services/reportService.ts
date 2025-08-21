import pool from "@/database/connection";
import { 
    FinancialReport, 
    OccupancyReport, 
    MinibarReport, 
    NotificationReport,
    ReportRequest,
    ReportExport 
} from "@/types";
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class ReportService {
    // ========================================
    // RELATÓRIOS FINANCEIROS
    // ========================================

    // Gerar relatório financeiro
    static async generateFinancialReport(request: ReportRequest): Promise<FinancialReport> {
        console.log('🔍 Iniciando geração do relatório financeiro...');
        const startDate = request.start_date || new Date(new Date().getFullYear(), 0, 1); // Início do ano
        const endDate = request.end_date || new Date();
        console.log('📅 Período:', { startDate, endDate });

        // Resumo geral
        const summaryQuery = `
            SELECT 
                COALESCE(SUM(p.amount), 0) as total_revenue,
                COUNT(p.id) as total_payments,
                COUNT(CASE WHEN p.status = 'pending' THEN 1 END) as pending_payments,
                COUNT(CASE WHEN p.status = 'refunded' THEN 1 END) as refunded_payments,
                COALESCE(AVG(p.amount), 0) as average_payment
            FROM payments p
            WHERE p.processed_at BETWEEN $1 AND $2
        `;

        const summaryResult = await pool.query(summaryQuery, [startDate, endDate]);
        const summary = summaryResult.rows[0];

        // Pagamentos por método
        const paymentsByMethodQuery = `
            SELECT 
                p.payment_method,
                COUNT(*) as count,
                SUM(p.amount) as total_amount
            FROM payments p
            WHERE p.processed_at BETWEEN $1 AND $2 AND p.status IN ('paid', 'partially_paid')
            GROUP BY p.payment_method
            ORDER BY total_amount DESC
        `;

        const paymentsByMethodResult = await pool.query(paymentsByMethodQuery, [startDate, endDate]);
        const totalRevenue = parseFloat(summary.total_revenue);
        
        const paymentsByMethod = paymentsByMethodResult.rows.map(row => ({
            method: row.payment_method,
            count: parseInt(row.count),
            total_amount: parseFloat(row.total_amount),
            percentage: totalRevenue > 0 ? (parseFloat(row.total_amount) / totalRevenue) * 100 : 0
        }));

        // Pagamentos por status
        const paymentsByStatusQuery = `
            SELECT 
                p.status,
                COUNT(*) as count,
                SUM(p.amount) as total_amount
            FROM payments p
            WHERE p.processed_at BETWEEN $1 AND $2
            GROUP BY p.status
            ORDER BY total_amount DESC
        `;

        const paymentsByStatusResult = await pool.query(paymentsByStatusQuery, [startDate, endDate]);
        
        const paymentsByStatus = paymentsByStatusResult.rows.map(row => ({
            status: row.status,
            count: parseInt(row.count),
            total_amount: parseFloat(row.total_amount),
            percentage: totalRevenue > 0 ? (parseFloat(row.total_amount) / totalRevenue) * 100 : 0
        }));

        // Receita diária
        const dailyRevenueQuery = `
            SELECT 
                DATE(p.processed_at) as date,
                SUM(p.amount) as revenue,
                COUNT(*) as payments_count
            FROM payments p
            WHERE p.processed_at BETWEEN $1 AND $2 AND p.status IN ('paid', 'partially_paid')
            GROUP BY DATE(p.processed_at)
            ORDER BY date
        `;

        const dailyRevenueResult = await pool.query(dailyRevenueQuery, [startDate, endDate]);
        
        const dailyRevenue = dailyRevenueResult.rows.map(row => ({
            date: row.date,
            revenue: parseFloat(row.revenue),
            payments_count: parseInt(row.payments_count)
        }));

        // Top reservas
        const topReservationsQuery = `
            SELECT 
                r.id as reservation_id,
                COALESCE(g.name, 'Hóspede não encontrado') as guest_name,
                COALESCE(rm.number, 'Quarto não encontrado') as room_number,
                r.total_amount,
                r.payment_status
            FROM reservations r
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE r.created_at BETWEEN $1 AND $2
            ORDER BY r.total_amount DESC
            LIMIT 10
        `;

        const topReservationsResult = await pool.query(topReservationsQuery, [startDate, endDate]);
        
        const topReservations = topReservationsResult.rows.map(row => ({
            reservation_id: row.reservation_id,
            guest_name: row.guest_name,
            room_number: row.room_number,
            total_amount: parseFloat(row.total_amount),
            payment_status: row.payment_status
        }));

        return {
            period: { start_date: startDate, end_date: endDate },
            summary: {
                total_revenue: parseFloat(summary.total_revenue),
                total_payments: parseInt(summary.total_payments),
                pending_payments: parseInt(summary.pending_payments),
                refunded_payments: parseInt(summary.refunded_payments),
                average_payment: parseFloat(summary.average_payment)
            },
            payments_by_method: paymentsByMethod,
            payments_by_status: paymentsByStatus,
            daily_revenue: dailyRevenue,
            top_reservations: topReservations
        };
    }

    // ========================================
    // RELATÓRIOS DE OCUPAÇÃO
    // ========================================

    // Gerar relatório de ocupação
    static async generateOccupancyReport(request: ReportRequest): Promise<OccupancyReport> {
        console.log('🔍 Iniciando geração do relatório de ocupação...');
        const startDate = request.start_date || new Date(new Date().getFullYear(), 0, 1);
        const endDate = request.end_date || new Date();
        console.log('📅 Período:', { startDate, endDate });

        try {
            // Resumo geral
            const summaryQuery = `
                SELECT 
                    COUNT(*) as total_rooms,
                    COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied_rooms,
                    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_rooms,
                    COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_rooms
                FROM rooms
            `;

            console.log('🔍 Executando query de resumo...');
            const summaryResult = await pool.query(summaryQuery);
            console.log('✅ Query de resumo executada com sucesso');
            
            const summary = summaryResult.rows[0];
            const totalRooms = parseInt(summary.total_rooms);
            const occupiedRooms = parseInt(summary.occupied_rooms);

        // Ocupação por tipo de quarto
        const occupancyByRoomTypeQuery = `
            SELECT 
                r.type as room_type,
                COUNT(*) as total_rooms,
                COUNT(CASE WHEN r.status = 'occupied' THEN 1 END) as occupied_rooms,
                COALESCE(SUM(CASE WHEN res.status IN ('confirmed', 'checked_in') AND res.check_in_date BETWEEN $1 AND $2 THEN res.total_amount ELSE 0 END), 0) as revenue
            FROM rooms r
            LEFT JOIN reservations res ON r.id = res.room_id
            GROUP BY r.type
            ORDER BY occupied_rooms DESC
        `;

        const occupancyByRoomTypeResult = await pool.query(occupancyByRoomTypeQuery, [startDate, endDate]);
        
        const occupancyByRoomType = occupancyByRoomTypeResult.rows.map(row => ({
            room_type: row.room_type,
            total_rooms: parseInt(row.total_rooms),
            occupied_rooms: parseInt(row.occupied_rooms),
            occupancy_rate: totalRooms > 0 ? (parseInt(row.occupied_rooms) / parseInt(row.total_rooms)) * 100 : 0,
            revenue: parseFloat(row.revenue)
        }));

        // Ocupação diária
        const dailyOccupancyQuery = `
            SELECT 
                DATE(r.check_in_date) as date,
                COUNT(CASE WHEN r.status IN ('confirmed', 'checked_in') THEN 1 END) as occupied_rooms,
                (SELECT COUNT(*) FROM rooms) as total_rooms
            FROM reservations r
            WHERE r.check_in_date BETWEEN $1 AND $2
            GROUP BY DATE(r.check_in_date)
            ORDER BY date
        `;

        const dailyOccupancyResult = await pool.query(dailyOccupancyQuery, [startDate, endDate]);
        
        const dailyOccupancy = dailyOccupancyResult.rows.map(row => ({
            date: row.date,
            occupied_rooms: parseInt(row.occupied_rooms),
            total_rooms: parseInt(row.total_rooms),
            available_rooms: parseInt(row.total_rooms) - parseInt(row.occupied_rooms),
            occupancy_rate: totalRooms > 0 ? (parseInt(row.occupied_rooms) / totalRooms) * 100 : 0
        }));

        // Check-ins e Check-outs
        const checkInsCheckOutsQuery = `
            SELECT 
                DATE(r.check_in_date) as date,
                COUNT(CASE WHEN r.status = 'checked_in' AND r.check_in_date BETWEEN $1 AND $2 THEN 1 END) as check_ins,
                COUNT(CASE WHEN r.status = 'checked_out' AND r.actual_check_out BETWEEN $1 AND $2 THEN 1 END) as check_outs
            FROM reservations r
            WHERE (r.check_in_date BETWEEN $1 AND $2) OR (r.actual_check_out BETWEEN $1 AND $2)
            GROUP BY DATE(r.check_in_date)
            ORDER BY date
        `;

        const checkInsCheckOutsResult = await pool.query(checkInsCheckOutsQuery, [startDate, endDate]);
        
        const checkInsCheckOuts = checkInsCheckOutsResult.rows.map(row => ({
            date: row.date,
            check_ins: parseInt(row.check_ins),
            check_outs: parseInt(row.check_outs),
            net_change: parseInt(row.check_ins) - parseInt(row.check_outs)
        }));

        // Top hóspedes
        const topGuestsQuery = `
            SELECT 
                g.id as guest_id,
                g.name as guest_name,
                COUNT(r.id) as total_reservations,
                COALESCE(SUM(r.total_amount), 0) as total_amount,
                COALESCE(AVG(EXTRACT(DAY FROM (r.check_out_date - r.check_in_date))), 0) as average_stay
            FROM guests g
            LEFT JOIN reservations r ON g.id = r.guest_id AND r.created_at BETWEEN $1 AND $2
            GROUP BY g.id, g.name
            ORDER BY total_reservations DESC
            LIMIT 10
        `;

        const topGuestsResult = await pool.query(topGuestsQuery, [startDate, endDate]);
        
        const topGuests = topGuestsResult.rows.map(row => ({
            guest_id: row.guest_id,
            guest_name: row.guest_name,
            total_reservations: parseInt(row.total_reservations),
            total_amount: parseFloat(row.total_amount),
            average_stay: parseFloat(row.average_stay)
        }));

        return {
            period: { start_date: startDate, end_date: endDate },
            summary: {
                total_rooms: totalRooms,
                occupied_rooms: occupiedRooms,
                available_rooms: parseInt(summary.available_rooms),
                maintenance_rooms: parseInt(summary.maintenance_rooms),
                occupancy_rate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
                average_stay_duration: 0 // Calculado separadamente se necessário
            },
            occupancy_by_room_type: occupancyByRoomType,
            daily_occupancy: dailyOccupancy,
            check_ins_check_outs: checkInsCheckOuts,
            top_guests: topGuests
        };
        } catch (error) {
            console.error('❌ Erro no relatório de ocupação:', error);
            throw error;
        }
    }

    // ========================================
    // RELATÓRIOS DE MINIBAR
    // ========================================

    // Gerar relatório de minibar
    static async generateMinibarReport(request: ReportRequest): Promise<MinibarReport> {
        console.log('🔍 Iniciando geração do relatório de minibar...');
        const startDate = request.start_date || new Date(new Date().getFullYear(), 0, 1);
        const endDate = request.end_date || new Date();
        console.log('📅 Período:', { startDate, endDate });

        // Resumo geral
        const summaryQuery = `
            SELECT 
                COUNT(*) as total_consumption,
                SUM(total_price) as total_revenue,
                AVG(total_price) as average_consumption_per_reservation,
                COUNT(DISTINCT reservation_id) as unique_reservations
            FROM minibar_consumption
            WHERE consumed_at BETWEEN $1 AND $2
        `;

        const summaryResult = await pool.query(summaryQuery, [startDate, endDate]);
        const summary = summaryResult.rows[0];

        // Consumo por categoria
        const consumptionByCategoryQuery = `
            SELECT 
                COALESCE(mi.category, 'Sem categoria') as category,
                COUNT(mc.id) as items_count,
                SUM(mc.quantity) as total_quantity,
                SUM(mc.total_price) as total_revenue
            FROM minibar_consumption mc
            LEFT JOIN minibar_items mi ON mc.minibar_item_id = mi.id
            WHERE mc.consumed_at BETWEEN $1 AND $2
            GROUP BY mi.category
            ORDER BY total_revenue DESC
        `;

        const consumptionByCategoryResult = await pool.query(consumptionByCategoryQuery, [startDate, endDate]);
        const totalRevenue = parseFloat(summary.total_revenue);
        
        const consumptionByCategory = consumptionByCategoryResult.rows.map(row => ({
            category: row.category,
            items_count: parseInt(row.items_count),
            total_quantity: parseInt(row.total_quantity),
            total_revenue: parseFloat(row.total_revenue),
            percentage: totalRevenue > 0 ? (parseFloat(row.total_revenue) / totalRevenue) * 100 : 0
        }));

        // Top itens consumidos
        const topConsumedItemsQuery = `
            SELECT 
                mi.id as item_id,
                COALESCE(mi.name, 'Item removido') as item_name,
                COALESCE(mi.category, 'Sem categoria') as category,
                SUM(mc.quantity) as quantity_sold,
                SUM(mc.total_price) as total_revenue,
                AVG(mc.unit_price) as average_price
            FROM minibar_consumption mc
            LEFT JOIN minibar_items mi ON mc.minibar_item_id = mi.id
            WHERE mc.consumed_at BETWEEN $1 AND $2
            GROUP BY mi.id, mi.name, mi.category
            ORDER BY quantity_sold DESC
            LIMIT 10
        `;

        const topConsumedItemsResult = await pool.query(topConsumedItemsQuery, [startDate, endDate]);
        
        const topConsumedItems = topConsumedItemsResult.rows.map(row => ({
            item_id: row.item_id,
            item_name: row.item_name,
            category: row.category,
            quantity_sold: parseInt(row.quantity_sold),
            total_revenue: parseFloat(row.total_revenue),
            average_price: parseFloat(row.average_price)
        }));

        // Consumo por reserva
        const consumptionByReservationQuery = `
            SELECT 
                mc.reservation_id,
                COALESCE(g.name, 'Hóspede não encontrado') as guest_name,
                COALESCE(rm.number, 'Quarto não encontrado') as room_number,
                COUNT(mc.id) as items_count,
                SUM(mc.total_price) as total_amount,
                MAX(mc.consumed_at) as consumption_date
            FROM minibar_consumption mc
            LEFT JOIN reservations r ON mc.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE mc.consumed_at BETWEEN $1 AND $2
            GROUP BY mc.reservation_id, g.name, rm.number
            ORDER BY total_amount DESC
            LIMIT 20
        `;

        const consumptionByReservationResult = await pool.query(consumptionByReservationQuery, [startDate, endDate]);
        
        const consumptionByReservation = consumptionByReservationResult.rows.map(row => ({
            reservation_id: row.reservation_id,
            guest_name: row.guest_name,
            room_number: row.room_number,
            items_count: parseInt(row.items_count),
            total_amount: parseFloat(row.total_amount),
            consumption_date: row.consumption_date
        }));

        // Consumo diário
        const dailyConsumptionQuery = `
            SELECT 
                DATE(mc.consumed_at) as date,
                COUNT(mc.id) as items_sold,
                SUM(mc.total_price) as total_revenue,
                COUNT(DISTINCT mc.reservation_id) as reservations_count
            FROM minibar_consumption mc
            WHERE mc.consumed_at BETWEEN $1 AND $2
            GROUP BY DATE(mc.consumed_at)
            ORDER BY date
        `;

        const dailyConsumptionResult = await pool.query(dailyConsumptionQuery, [startDate, endDate]);
        
        const dailyConsumption = dailyConsumptionResult.rows.map(row => ({
            date: row.date,
            items_sold: parseInt(row.items_sold),
            total_revenue: parseFloat(row.total_revenue),
            reservations_count: parseInt(row.reservations_count)
        }));

        return {
            period: { start_date: startDate, end_date: endDate },
            summary: {
                total_consumption: parseInt(summary.total_consumption),
                total_revenue: parseFloat(summary.total_revenue),
                average_consumption_per_reservation: parseFloat(summary.average_consumption_per_reservation),
                most_consumed_item: topConsumedItems.length > 0 ? topConsumedItems[0]?.item_name || 'N/A' : 'N/A'
            },
            consumption_by_category: consumptionByCategory,
            top_consumed_items: topConsumedItems,
            consumption_by_reservation: consumptionByReservation,
            daily_consumption: dailyConsumption
        };
    }

    // ========================================
    // RELATÓRIOS DE NOTIFICAÇÕES
    // ========================================

    // Gerar relatório de notificações
    static async generateNotificationReport(request: ReportRequest): Promise<NotificationReport> {
        const startDate = request.start_date || new Date(new Date().getFullYear(), 0, 1);
        const endDate = request.end_date || new Date();

        // Resumo geral
        const summaryQuery = `
            SELECT 
                COUNT(*) as total_notifications,
                COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_notifications,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_notifications
            FROM notifications
            WHERE created_at BETWEEN $1 AND $2
        `;

        const summaryResult = await pool.query(summaryQuery, [startDate, endDate]);
        const summary = summaryResult.rows[0];
        const totalNotifications = parseInt(summary.total_notifications);
        const sentNotifications = parseInt(summary.sent_notifications);

        // Notificações por tipo
        const notificationsByTypeQuery = `
            SELECT 
                type,
                COUNT(*) as count,
                COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
            FROM notifications
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY type
            ORDER BY count DESC
        `;

        const notificationsByTypeResult = await pool.query(notificationsByTypeQuery, [startDate, endDate]);
        
        const notificationsByType = notificationsByTypeResult.rows.map(row => ({
            type: row.type,
            count: parseInt(row.count),
            sent_count: parseInt(row.sent_count),
            failed_count: parseInt(row.failed_count),
            success_rate: parseInt(row.count) > 0 ? (parseInt(row.sent_count) / parseInt(row.count)) * 100 : 0
        }));

        // Notificações por status
        const notificationsByStatusQuery = `
            SELECT 
                status,
                COUNT(*) as count
            FROM notifications
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY status
            ORDER BY count DESC
        `;

        const notificationsByStatusResult = await pool.query(notificationsByStatusQuery, [startDate, endDate]);
        
        const notificationsByStatus = notificationsByStatusResult.rows.map(row => ({
            status: row.status,
            count: parseInt(row.count),
            percentage: totalNotifications > 0 ? (parseInt(row.count) / totalNotifications) * 100 : 0
        }));

        // Notificações diárias
        const dailyNotificationsQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(CASE WHEN status = 'sent' THEN 1 END) as total_sent,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed
            FROM notifications
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY DATE(created_at)
            ORDER BY date
        `;

        const dailyNotificationsResult = await pool.query(dailyNotificationsQuery, [startDate, endDate]);
        
        const dailyNotifications = dailyNotificationsResult.rows.map(row => {
            const sent = parseInt(row.total_sent);
            const failed = parseInt(row.total_failed);
            const total = sent + failed;
            return {
                date: row.date,
                total_sent: sent,
                total_failed: failed,
                success_rate: total > 0 ? (sent / total) * 100 : 0
            };
        });

        return {
            period: { start_date: startDate, end_date: endDate },
            summary: {
                total_notifications: totalNotifications,
                sent_notifications: sentNotifications,
                failed_notifications: parseInt(summary.failed_notifications),
                success_rate: totalNotifications > 0 ? (sentNotifications / totalNotifications) * 100 : 0
            },
            notifications_by_type: notificationsByType,
            notifications_by_status: notificationsByStatus,
            daily_notifications: dailyNotifications,
            top_notification_triggers: notificationsByType.map(item => ({
                trigger_type: item.type,
                count: item.count,
                percentage: totalNotifications > 0 ? (item.count / totalNotifications) * 100 : 0
            }))
        };
    }

    // ========================================
    // EXPORTAÇÃO DE RELATÓRIOS
    // ========================================

    // Exportar relatório para Excel
    static async exportToExcel(data: any, reportName: string): Promise<ReportExport> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Relatório');

        // Adicionar dados ao worksheet
        if (Array.isArray(data)) {
            // Se for array, usar primeira linha como cabeçalho
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);
                
                data.forEach(row => {
                    worksheet.addRow(Object.values(row));
                });
            }
        } else {
            // Se for objeto, criar múltiplas abas
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    const ws = workbook.addWorksheet(key);
                    if (value.length > 0) {
                        const headers = Object.keys(value[0]);
                        ws.addRow(headers);
                        value.forEach(row => {
                            ws.addRow(Object.values(row));
                        });
                    }
                }
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        
        return {
            filename: `${reportName}_${new Date().toISOString().split('T')[0]}.xlsx`,
            content: Buffer.from(buffer),
            mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: Buffer.from(buffer).length
        };
    }

    // Exportar relatório para PDF
    static async exportToPDF(data: any, reportName: string): Promise<ReportExport> {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {});

        // Cabeçalho
        doc.fontSize(20).text(`Relatório: ${reportName}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });
        doc.moveDown(2);

        // Adicionar dados
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(item)}`);
                doc.moveDown();
            });
        } else {
            Object.entries(data).forEach(([key, value]) => {
                doc.fontSize(14).text(key.toUpperCase());
                doc.moveDown();
                
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(item)}`);
                        doc.moveDown();
                    });
                } else {
                    doc.fontSize(10).text(JSON.stringify(value, null, 2));
                }
                doc.moveDown(2);
            });
        }

        doc.end();

        const buffer = Buffer.concat(chunks);
        
        return {
            filename: `${reportName}_${new Date().toISOString().split('T')[0]}.pdf`,
            content: buffer,
            mime_type: 'application/pdf',
            size: buffer.length
        };
    }

    // Exportar relatório para CSV
    static async exportToCSV(data: any, reportName: string): Promise<ReportExport> {
        let csvContent = '';

        if (Array.isArray(data)) {
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                csvContent += headers.join(',') + '\n';
                
                data.forEach(row => {
                    csvContent += Object.values(row).join(',') + '\n';
                });
            }
        } else {
            // Para objetos, criar múltiplas seções
            Object.entries(data).forEach(([key, value]) => {
                csvContent += `\n${key.toUpperCase()}\n`;
                if (Array.isArray(value) && value.length > 0) {
                    const headers = Object.keys(value[0]);
                    csvContent += headers.join(',') + '\n';
                    value.forEach(row => {
                        csvContent += Object.values(row).join(',') + '\n';
                    });
                }
            });
        }

        const buffer = Buffer.from(csvContent, 'utf-8');
        
        return {
            filename: `${reportName}_${new Date().toISOString().split('T')[0]}.csv`,
            content: buffer,
            mime_type: 'text/csv',
            size: buffer.length
        };
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter tipos de relatório disponíveis
    static getAvailableReportTypes(): string[] {
        return ['financial', 'occupancy', 'minibar', 'notifications', 'custom'];
    }

    // Obter formatos de exportação disponíveis
    static getAvailableExportFormats(): string[] {
        return ['pdf', 'excel', 'csv', 'json'];
    }

    // Validar parâmetros de relatório
    static validateReportRequest(request: ReportRequest): boolean {
        if (!request.report_type || !request.format) {
            return false;
        }

        if (!this.getAvailableReportTypes().includes(request.report_type)) {
            return false;
        }

        if (!this.getAvailableExportFormats().includes(request.format)) {
            return false;
        }

        if (request.start_date && request.end_date && request.start_date > request.end_date) {
            return false;
        }

        return true;
    }
}
