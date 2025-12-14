import {Ticket} from '@/src/domain/model/Ticket';
import {TicketRepository} from '@/src/domain/repository/TicketRepository';
import {TicketFirebaseDataSource} from "@/src/data/datasource/firebase/TicketFirebaseDataSource";

export class TicketRepositoryImpl implements TicketRepository {

    constructor(private dataSource: TicketFirebaseDataSource) {
    }

    async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
        return this.dataSource.create(ticket);
    }

    async createBatch(tickets: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Ticket[]> {
        return this.dataSource.createBatch(tickets);
    }

    async findById(id: string): Promise<Ticket | null> {
        return this.dataSource.findById(id);
    }

    async findByOrderId(orderId: string): Promise<Ticket[]> {
        return this.dataSource.findByOrderId(orderId);
    }

    async findByEventId(eventId: string): Promise<Ticket[]> {
        return this.dataSource.findByEventId(eventId);
    }

    async findByTicketNumber(ticketNumber: string): Promise<Ticket | null> {
        return this.dataSource.findByTicketNumber(ticketNumber);
    }

    async findByQrCode(qrCode: string): Promise<Ticket | null> {
        return this.dataSource.findByQrCode(qrCode);
    }

    async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
        return this.dataSource.update(id, ticket);
    }

    async updateStatus(id: string, status: Ticket['status']): Promise<Ticket> {
        return this.dataSource.updateStatus(id, status);
    }

    async validateTicket(id: string): Promise<Ticket> {
        return this.dataSource.validateTicket(id);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }
}
