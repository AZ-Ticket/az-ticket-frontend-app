import {Order} from '../../model/Order';
import {Ticket} from '../../model/Ticket';
import {OrderRepository} from '../../repository/OrderRepository';
import {EventRepository} from '../../repository/EventRepository';
import {TicketRepository} from '../../repository/TicketRepository';
import {EventTicketRepository} from '../../repository/EventTicketRepository';

export class CreateOrderUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private eventRepository: EventRepository,
        private ticketRepository: TicketRepository,
        private eventTicketRepository: EventTicketRepository
    ) {
    }

    async execute(
        userId: string,
        eventId: string,
        items: { eventTicketId: string; quantity: number }[],
        paymentMethod: string
    ): Promise<{ order: Order; tickets: Ticket[] }> {
        const event = await this.eventRepository.findById(eventId);

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.status !== 'published') {
            throw new Error('Event is not available for booking');
        }

        const eventTickets = await this.eventTicketRepository.findByEventId(eventId);
        if (eventTickets.length === 0) {
            throw new Error('No tickets available for this event');
        }
        event.eventTickets = eventTickets;

        let totalAmount = 0;
        const ticketsData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>[] = [];
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        if (totalQuantity <= 0) {
            throw new Error('Total quantity must be greater than 0');
        }

        for (const item of items) {
            if (item.quantity <= 0) continue;

            const eventTicket = event.eventTickets.find(t => t.id === item.eventTicketId);
            if (!eventTicket) {
                throw new Error(`Ticket type ${item.eventTicketId} not found in event`);
            }

            if (eventTicket.available < item.quantity) {
                throw new Error(`Not enough tickets available for ${eventTicket.description || 'selected type'}`);
            }

            totalAmount += eventTicket.price * item.quantity;
        }

        const order = await this.orderRepository.create({
            userId,
            eventId,
            quantity: totalQuantity,
            totalAmount,
            status: 'pending',
            paymentMethod,
            paymentStatus: 'pending',
        });

        let ticketIndex = 1;
        for (const item of items) {
            if (item.quantity <= 0) continue;

            const eventTicket = event.eventTickets.find(t => t.id === item.eventTicketId)!;

            await this.eventTicketRepository.update(eventTicket.id, {
                available: eventTicket.available - item.quantity
            });

            for (let i = 0; i < item.quantity; i++) {
                ticketsData.push({
                    eventId,
                    eventTicketId: eventTicket.id,
                    orderId: order.id,
                    ticketNumber: `${event.id}-${order.id}-${ticketIndex}`,
                    status: 'active' as const,
                    qrCode: `QR-${order.id}-${ticketIndex}`,
                });
                ticketIndex++;
            }
        }

        const tickets = await this.ticketRepository.createBatch(ticketsData);

        return {order, tickets};
    }
}
