import { Guest } from "@/types";
export declare class GuestService {
    static findOrCreateGuest(guestData: {
        name: string;
        email: string;
        phone?: string;
        document: string;
        nationality?: string;
        language_preference?: string;
    }): Promise<Guest>;
    static findGuestByEmail(email: string): Promise<Guest | null>;
    static findGuestById(id: number): Promise<Guest | null>;
    static updateGuest(id: number, guestData: {
        name?: string;
        phone?: string;
        document?: string;
        nationality?: string;
        language_preference?: string;
    }): Promise<Guest | null>;
    static getAllGuests(filters: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        guests: Guest[];
        total: number;
        pagination: any;
    }>;
}
//# sourceMappingURL=guestService.d.ts.map