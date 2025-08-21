import { MinibarItem, MinibarConsumption, MinibarItemCreate, MinibarItemUpdate, MinibarConsumptionCreate } from "@/types";
export declare class MinibarService {
    static getAllItems(): Promise<MinibarItem[]>;
    static getItemById(id: number): Promise<MinibarItem | null>;
    static createItem(itemData: MinibarItemCreate): Promise<MinibarItem>;
    static updateItem(id: number, itemData: MinibarItemUpdate): Promise<MinibarItem | null>;
    static deleteItem(id: number): Promise<boolean>;
    static getItemsByCategory(category: string): Promise<MinibarItem[]>;
    static recordConsumption(consumptionData: MinibarConsumptionCreate): Promise<MinibarConsumption>;
    static getConsumptionByReservation(reservationId: number): Promise<MinibarConsumption[]>;
    static getConsumptionByPeriod(startDate: Date, endDate: Date): Promise<MinibarConsumption[]>;
    static getTotalConsumptionByReservation(reservationId: number): Promise<number>;
    static getConsumptionStats(startDate?: Date, endDate?: Date): Promise<any>;
    static getConsumptionByItem(itemId: number, startDate?: Date, endDate?: Date): Promise<MinibarConsumption[]>;
    static validateReservation(reservationId: number): Promise<boolean>;
    static getCategories(): Promise<string[]>;
}
//# sourceMappingURL=minibarService.d.ts.map