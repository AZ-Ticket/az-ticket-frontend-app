import type {EventFirebaseDto} from "@/data/datasource/firebase/dto/EventFirebaseDto";
import type {Event} from "@/domain/model/Event";

export const FirebaseEventMapper = {
    toDomain(dto: EventFirebaseDto): Event {
        return {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            venue: dto.venue,
            address: dto.address,
            date: dto.date,
            time: dto.time,
            imageUrl: dto.imageUrl,
            category: dto.category,
            eventTickets: [],
            organizerId: dto.organizerId,
            status: dto.status,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    },

    toDto(event: Event): EventFirebaseDto {
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            venue: event.venue,
            address: event.address,
            date: event.date,
            time: event.time,
            imageUrl: event.imageUrl,
            category: event.category,
            organizerId: event.organizerId,
            status: event.status,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    },
};

export default FirebaseEventMapper;
