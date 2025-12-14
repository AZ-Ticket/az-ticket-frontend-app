import type {TicketFirebaseDto} from "@/data/datasource/firebase/dto/TicketFirebaseDto";
import type {Ticket} from "@/domain/model/Ticket";

export const FirebaseTicketMapper = {
    toDomain(dto: TicketFirebaseDto): Ticket {
        return {
            id: dto.id,
            eventId: dto.eventId,
            eventTicketId: dto.eventTicketId,
            orderId: dto.orderId,
            ticketNumber: dto.ticketNumber,
            seatNumber: dto.seatNumber,
            status: dto.status,
            qrCode: dto.qrCode,
            validatedAt: dto.validatedAt,
            validUntil: dto.validUntil,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    },

    toDto(ticket: Ticket): TicketFirebaseDto {
        return {
            id: ticket.id,
            eventId: ticket.eventId,
            eventTicketId: ticket.eventTicketId,
            orderId: ticket.orderId,
            ticketNumber: ticket.ticketNumber,
            seatNumber: ticket.seatNumber,
            status: ticket.status,
            qrCode: ticket.qrCode,
            validatedAt: ticket.validatedAt,
            validUntil: ticket.validUntil,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        };
    },
};

export default FirebaseTicketMapper;
