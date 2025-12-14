import {Event} from '../../model/Event';
import {EventRepository} from '../../repository/EventRepository';
import {EventTicketRepository} from "@/domain/repository/EventTicketRepository";

export class GetEventByIdUseCase {
    constructor(
        private eventRepository: EventRepository,
        private eventTicketRepository: EventTicketRepository
    ) { }

    async execute(eventId: string): Promise<Event> {
        const event = await this.eventRepository.findById(eventId);
        const eventTickets = await this.eventTicketRepository.findByEventId(eventId);

        if (!event) {
            throw new Error('Event not found');
        }

        if (eventTickets.length > 0) {
            event.eventTickets = eventTickets;
        }

        return event;
    }
}
