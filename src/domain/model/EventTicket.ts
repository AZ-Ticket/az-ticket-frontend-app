export interface EventTicket {
    id: string;
    eventId: string;
    description?: string;
    price: number;
    quantity: number;
    available: number;
    availableUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}
