import {Event} from '../../model/Event';
import {EventRepository} from '../../repository/EventRepository';
import {EventTicketRepository} from "@/domain/repository/EventTicketRepository";

export class CreateEventUseCase {
    constructor(
        private eventRepository: EventRepository,
        private eventTicketRepository: EventTicketRepository
    ) {
    }

    async execute(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
        if (eventData.eventTickets.length <= 0) {
            throw new Error('Total tickets must be greater than 0');
        }

        const event = await this.eventRepository.create({...eventData});

        const eventTickets = eventData.eventTickets.map(ticket => ({
            ...ticket,
            eventId: event.id,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
        }));

        await this.eventTicketRepository.createBatch(eventTickets);

        return event;
    }
}
