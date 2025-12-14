import {EventTicket} from "@/domain/model/EventTicket";

export interface EventTicketRepository {
  create(eventTicket: Omit<EventTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventTicket>;
  createBatch(eventTickets: Omit<EventTicket, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<EventTicket[]>;
  findById(id: string): Promise<EventTicket | null>;
  findByEventId(eventId: string): Promise<EventTicket[]>;
  update(id: string, eventTicket: Partial<EventTicket>): Promise<EventTicket>;
  delete(id: string): Promise<void>;
}
