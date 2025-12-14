import {Event} from '@/src/domain/model/Event';
import {EventRepository} from '@/src/domain/repository/EventRepository';
import {EventFirebaseDataSource} from "@/src/data/datasource/firebase/EventFirebaseDataSource";
import FirebaseEventMapper from "@/src/data/datasource/firebase/mapper/FirebaseEventMapper";

export class EventRepositoryImpl implements EventRepository {

    constructor(private dataSource: EventFirebaseDataSource) {
    }

    async create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'eventTickets'>): Promise<Event> {
        const eventDto = await this.dataSource.create(event);
        return FirebaseEventMapper.toDomain(eventDto);
    }

    async findById(id: string): Promise<Event | null> {
        const eventDto = await this.dataSource.findById(id);
        return eventDto ? FirebaseEventMapper.toDomain(eventDto) : null;
    }

    async findAll(): Promise<Event[]> {
        const eventsDto = await this.dataSource.findAll();
        return eventsDto.map(FirebaseEventMapper.toDomain);
    }

    async findByCategory(category: string): Promise<Event[]> {
        const eventsDto = await this.dataSource.findByCategory(category);
        return eventsDto.map(FirebaseEventMapper.toDomain);
    }

    async findByStatus(status: Event['status']): Promise<Event[]> {
        const eventsDto = await this.dataSource.findByStatus(status);
        return eventsDto.map(FirebaseEventMapper.toDomain);
    }

    async findByOrganizer(organizerId: string): Promise<Event[]> {
        const eventsDto = await this.dataSource.findByOrganizer(organizerId);
        return eventsDto.map(FirebaseEventMapper.toDomain);
    }

    async update(id: string, event: Partial<Event>): Promise<Event> {
        const eventDto = await this.dataSource.update(id, event);
        return FirebaseEventMapper.toDomain(eventDto);
    }

    async delete(id: string): Promise<void> {
        await this.dataSource.delete(id);
    }
}
