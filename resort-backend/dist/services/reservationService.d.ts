export declare class ReservationService {
    static getReservations(filters?: {
        status?: string;
        room_id?: number;
        guest_id?: number;
        date_from?: Date;
        date_to?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        reservations: any[];
        total: number;
        pagination: any;
    }>;
    static getReservationById(id: number): Promise<any | null>;
    static createReservation(reservationData: {
        guest_id: number;
        room_id: number;
        check_in_date: Date;
        check_out_date: Date;
        total_guests: number;
        total_amount: number;
        special_requests?: string;
        created_by: number;
    }): Promise<any>;
    static checkIn(reservationId: number): Promise<any | null>;
    static checkOut(reservationId: number, additionalCharges?: number): Promise<any | null>;
    static cancelReservation(reservationId: number): Promise<any | null>;
    static getUpcomingCheckOuts(): Promise<any[]>;
    static getTodayCheckIns(): Promise<any[]>;
}
//# sourceMappingURL=reservationService.d.ts.map