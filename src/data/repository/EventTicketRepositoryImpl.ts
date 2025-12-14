import {EventTicketRepository} from "@/src/domain/repository/EventTicketRepository";
import {EventTicketFirebaseDataSource} from "@/src/data/datasource/firebase/EventTicketFirebaseDataSource";
import {EventTicket} from "@/src/domain/model/EventTicket";

export class EventTicketRepositoryImpl implements EventTicketRepository {

    constructor(private dataSource: EventTicketFirebaseDataSource) {
    }

    create(eventTicket: Omit<EventTicket, "id" | "createdAt" | "updatedAt">): Promise<EventTicket> {
        return this.dataSource.create(eventTicket);
    }

    createBatch(eventTickets: Omit<EventTicket, "id" | "createdAt" | "updatedAt">[]): Promise<EventTicket[]> {
        return this.dataSource.createBatch(eventTickets);
    }

    delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }

    findByEventId(eventId: string): Promise<EventTicket[]> {
        return this.dataSource.findByEventId(eventId)
    }

    findById(id: string): Promise<EventTicket | null> {
        return this.dataSource.findById(id);
    }

    update(id: string, eventTicket: Partial<EventTicket>): Promise<EventTicket> {
        return this.dataSource.update(id, eventTicket);
    }
}
