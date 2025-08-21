import { Room } from "@/types";
export declare class RoomService {
    static getAllRooms(filters: {
        status?: string;
        type?: string;
        floor?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        rooms: Room[];
        total: number;
        pagination: any;
    }>;
    static getRoomById(id: string): Promise<Room | null>;
    static createRoom(roomData: {
        number: number;
        type: string;
        capacity: number;
        price_per_night: number;
        amenities: string[];
        floor?: number;
        description?: string;
        images?: string[];
    }): Promise<Room>;
    static updateRoom(id: string, roomData: {
        number?: number;
        type?: string;
        capacity?: number;
        price_per_night?: number;
        amenities?: string[];
        status?: string;
        floor?: number;
        description?: string;
        images?: string[];
    }): Promise<Room | null>;
    static deleteRoom(id: string): Promise<boolean>;
    static checkAvailability(roomId: number, checkIn: Date, checkOut: Date): Promise<boolean>;
    static getAvailableRooms(checkIn: Date, checkOut: Date): Promise<Room[]>;
}
//# sourceMappingURL=roomService.d.ts.map