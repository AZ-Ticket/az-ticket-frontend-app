import { Event } from '../model/Event';

export interface EventRepository {
  create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'eventTickets'>): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  findByCategory(category: string): Promise<Event[]>;
  findByStatus(status: Event['status']): Promise<Event[]>;
  findByOrganizer(organizerId: string): Promise<Event[]>;
  update(id: string, event: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
}
