import {EventTicket} from "@/domain/model/EventTicket";

export interface Event {
    id: string;
    title: string;
    description: string;
    venue: string;
    address: string;
    date: Date;
    time: string;
    imageUrl?: string;
    category: string;
    eventTickets: EventTicket[];
    organizerId: string;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
