import type {EventTicketFirebaseDto} from "@/data/datasource/firebase/dto/EventTicketFirebaseDto";
import type {EventTicket} from "@/domain/model/EventTicket";

export const FirebaseEventTicketMapper = {
    toDomain(dto: EventTicketFirebaseDto): EventTicket {
        return {
            id: dto.id,
            eventId: dto.eventId,
            description: dto.description,
            price: dto.price,
            quantity: dto.quantity,
            available: dto.available,
            availableUntil: dto.availableUntil,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    },

    toDto(ticket: EventTicket): EventTicketFirebaseDto {
        return {
            id: ticket.id,
            eventId: ticket.eventId,
            description: ticket.description,
            price: ticket.price,
            quantity: ticket.quantity,
            available: ticket.available,
            availableUntil: ticket.availableUntil,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        };
    },
};

export default FirebaseEventTicketMapper;
