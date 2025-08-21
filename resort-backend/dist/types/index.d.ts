export interface User {
    id: number;
    email: string;
    password_hash: string;
    role: 'admin' | 'employee';
    name: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Guest {
    id: number;
    name: string;
    email: string;
    phone?: string;
    document: string;
    nationality?: string;
    language_preference: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Room {
    id: number;
    name: string;
    type: string;
    capacity: number;
    price_per_night: number;
    amenities: string[];
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    floor?: number;
    description?: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Reservation {
    id: number;
    guest_id: number;
    room_id: number;
    check_in_date: Date;
    check_out_date: Date;
    actual_check_in?: Date;
    actual_check_out?: Date;
    total_guests: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded';
    special_requests?: string;
    created_by: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface MinibarItem {
    id: number;
    name: string;
    price: number;
    category: string;
    is_active: boolean;
    created_at: Date;
}
export interface MinibarConsumption {
    id: number;
    reservation_id: number;
    minibar_item_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    consumed_at: Date;
    recorded_by: number;
    item?: MinibarItem;
    reservation?: Reservation;
    recorded_by_user?: User;
}
export interface MinibarConsumptionCreate {
    reservation_id: number;
    minibar_item_id: number;
    quantity: number;
    recorded_by: number;
}
export interface MinibarItemCreate {
    name: string;
    price: number;
    category: string;
}
export interface MinibarItemUpdate {
    name?: string;
    price?: number;
    category?: string;
    is_active?: boolean;
}
export interface Payment {
    id: number;
    reservation_id: number;
    amount: number;
    payment_method: string;
    transaction_id?: string;
    status: 'pending' | 'paid' | 'partially_paid' | 'refunded';
    processed_by: number;
    processed_at: Date;
    reservation?: Reservation;
    processed_by_user?: User;
}
export interface PaymentCreate {
    reservation_id: number;
    amount: number;
    payment_method: string;
    transaction_id?: string;
    processed_by: number;
}
export interface PaymentUpdate {
    amount?: number;
    payment_method?: string;
    transaction_id?: string;
    status?: 'pending' | 'paid' | 'partially_paid' | 'refunded';
}
export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}
export interface Notification {
    id: number;
    reservation_id: number;
    type: 'checkout_1h' | 'checkout_30min' | 'checkin_reminder' | 'payment_reminder' | 'minibar_consumption' | 'system_alert';
    message: string;
    sent_at?: Date;
    status: 'pending' | 'sent' | 'failed';
    created_at: Date;
    reservation?: Reservation;
    guest?: Guest;
    room?: Room;
}
export interface NotificationCreate {
    reservation_id: number;
    type: 'checkout_1h' | 'checkout_30min' | 'checkin_reminder' | 'payment_reminder' | 'minibar_consumption' | 'system_alert';
    message: string;
}
export interface NotificationUpdate {
    sent_at?: Date;
    status?: 'pending' | 'sent' | 'failed';
}
export interface NotificationTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    is_active: boolean;
}
export interface FileUpload {
    id: number;
    original_name: string;
    filename: string;
    path: string;
    size: number;
    mime_type: string;
    category: 'room_image' | 'guest_document' | 'payment_receipt' | 'system_file';
    entity_type: 'room' | 'guest' | 'payment' | 'system';
    entity_id?: number;
    uploaded_by: number;
    is_active: boolean;
    created_at: Date;
    uploaded_by_user?: User;
}
export interface FileUploadCreate {
    original_name: string;
    filename: string;
    path: string;
    size: number;
    mime_type: string;
    category: 'room_image' | 'guest_document' | 'payment_receipt' | 'system_file';
    entity_type: 'room' | 'guest' | 'payment' | 'system';
    entity_id?: number | undefined;
    uploaded_by: number;
}
export interface FileUploadUpdate {
    is_active?: boolean;
    entity_id?: number;
}
export interface UploadConfig {
    maxFileSize: number;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
    uploadPath: string;
}
export interface ReportConfig {
    id: string;
    name: string;
    description: string;
    type: 'financial' | 'occupancy' | 'minibar' | 'notifications' | 'custom';
    format: 'pdf' | 'excel' | 'csv' | 'json';
    is_active: boolean;
    created_at: Date;
}
export interface ReportRequest {
    report_type: 'financial' | 'occupancy' | 'minibar' | 'notifications' | 'custom';
    format: 'pdf' | 'excel' | 'csv' | 'json';
    start_date?: Date | undefined;
    end_date?: Date | undefined;
    filters?: Record<string, any>;
    group_by?: string[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    limit?: number;
}
export interface FinancialReport {
    period: {
        start_date: Date;
        end_date: Date;
    };
    summary: {
        total_revenue: number;
        total_payments: number;
        pending_payments: number;
        refunded_payments: number;
        average_payment: number;
    };
    payments_by_method: Array<{
        method: string;
        count: number;
        total_amount: number;
        percentage: number;
    }>;
    payments_by_status: Array<{
        status: string;
        count: number;
        total_amount: number;
        percentage: number;
    }>;
    daily_revenue: Array<{
        date: string;
        revenue: number;
        payments_count: number;
    }>;
    top_reservations: Array<{
        reservation_id: number;
        guest_name: string;
        room_number: string;
        total_amount: number;
        payment_status: string;
    }>;
}
export interface OccupancyReport {
    period: {
        start_date: Date;
        end_date: Date;
    };
    summary: {
        total_rooms: number;
        occupied_rooms: number;
        available_rooms: number;
        maintenance_rooms: number;
        occupancy_rate: number;
        average_stay_duration: number;
    };
    occupancy_by_room_type: Array<{
        room_type: string;
        total_rooms: number;
        occupied_rooms: number;
        occupancy_rate: number;
        revenue: number;
    }>;
    daily_occupancy: Array<{
        date: string;
        occupied_rooms: number;
        available_rooms: number;
        occupancy_rate: number;
    }>;
    check_ins_check_outs: Array<{
        date: string;
        check_ins: number;
        check_outs: number;
        net_change: number;
    }>;
    top_guests: Array<{
        guest_id: number;
        guest_name: string;
        total_reservations: number;
        total_amount: number;
        average_stay: number;
    }>;
}
export interface MinibarReport {
    period: {
        start_date: Date;
        end_date: Date;
    };
    summary: {
        total_consumption: number;
        total_revenue: number;
        average_consumption_per_reservation: number;
        most_consumed_item: string;
    };
    consumption_by_category: Array<{
        category: string;
        items_count: number;
        total_quantity: number;
        total_revenue: number;
        percentage: number;
    }>;
    top_consumed_items: Array<{
        item_id: number;
        item_name: string;
        category: string;
        quantity_sold: number;
        total_revenue: number;
        average_price: number;
    }>;
    consumption_by_reservation: Array<{
        reservation_id: number;
        guest_name: string;
        room_number: string;
        items_count: number;
        total_amount: number;
        consumption_date: Date;
    }>;
    daily_consumption: Array<{
        date: string;
        items_sold: number;
        total_revenue: number;
        reservations_count: number;
    }>;
}
export interface NotificationReport {
    period: {
        start_date: Date;
        end_date: Date;
    };
    summary: {
        total_notifications: number;
        sent_notifications: number;
        failed_notifications: number;
        success_rate: number;
    };
    notifications_by_type: Array<{
        type: string;
        count: number;
        sent_count: number;
        failed_count: number;
        success_rate: number;
    }>;
    notifications_by_status: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
    daily_notifications: Array<{
        date: string;
        total_sent: number;
        total_failed: number;
        success_rate: number;
    }>;
    top_notification_triggers: Array<{
        trigger_type: string;
        count: number;
        percentage: number;
    }>;
}
export interface CustomReport {
    report_name: string;
    generated_at: Date;
    data: any;
    metadata: {
        filters_applied: Record<string, any>;
        total_records: number;
        execution_time: number;
    };
}
export interface ReportExport {
    filename: string;
    content: Buffer;
    mime_type: string;
    size: number;
}
export interface JWTPayload {
    userId: number;
    email: string;
    role: 'admin' | 'employee';
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map