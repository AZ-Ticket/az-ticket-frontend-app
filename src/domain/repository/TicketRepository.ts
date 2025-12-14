import { Ticket } from '../model/Ticket';

export interface TicketRepository {
  create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
  createBatch(tickets: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByOrderId(orderId: string): Promise<Ticket[]>;
  findByEventId(eventId: string): Promise<Ticket[]>;
  findByTicketNumber(ticketNumber: string): Promise<Ticket | null>;
  findByQrCode(qrCode: string): Promise<Ticket | null>;
  update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
  updateStatus(id: string, status: Ticket['status']): Promise<Ticket>;
  validateTicket(id: string): Promise<Ticket>;
  delete(id: string): Promise<void>;
}
