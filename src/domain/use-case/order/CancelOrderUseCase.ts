import { Order } from '../../model/Order';
import { OrderRepository } from '../../repository/OrderRepository';
import { TicketRepository } from '../../repository/TicketRepository';
import { EventRepository } from '../../repository/EventRepository';
import { EventTicketRepository } from '../../repository/EventTicketRepository';

export class CancelOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private eventRepository: EventRepository,
    private eventTicketRepository: EventTicketRepository
  ) {}

  async execute(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    if (order.status === 'cancelled') {
      throw new Error('Order is already cancelled');
    }

    if (order.status === 'confirmed' && order.paymentStatus === 'completed') {
      throw new Error('Cannot cancel a completed order. Please request a refund instead.');
    }

    const updatedOrder = await this.orderRepository.updateStatus(orderId, 'cancelled');

    const tickets = await this.ticketRepository.findByOrderId(orderId);
    await Promise.all(
      tickets.map(ticket => this.ticketRepository.updateStatus(ticket.id, 'cancelled'))
    );

    // Restore availability
    const ticketCounts: Record<string, number> = {};
    for (const ticket of tickets) {
         if (ticket.eventTicketId) {
             ticketCounts[ticket.eventTicketId] = (ticketCounts[ticket.eventTicketId] || 0) + 1;
         }
    }

    for (const [eventTicketId, count] of Object.entries(ticketCounts)) {
        const eventTicket = await this.eventTicketRepository.findById(eventTicketId);
         if (eventTicket) {
             await this.eventTicketRepository.update(eventTicketId, {
                 available: eventTicket.available + count
             });
         }
    }

    return updatedOrder;
  }
}
