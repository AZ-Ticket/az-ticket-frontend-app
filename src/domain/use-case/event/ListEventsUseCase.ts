import { Event } from '../../model/Event';
import { EventRepository } from '../../repository/EventRepository';

export class ListEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(filters?: {
    category?: string;
    status?: Event['status'];
    organizerId?: string;
  }): Promise<Event[]> {
    if (filters?.category) {
      return await this.eventRepository.findByCategory(filters.category);
    }

    if (filters?.status) {
      return await this.eventRepository.findByStatus(filters.status);
    }

    if (filters?.organizerId) {
      return await this.eventRepository.findByOrganizer(filters.organizerId);
    }

    return await this.eventRepository.findAll();
  }
}
