import { Ticket } from '../../model/Ticket';
import { TicketRepository } from '../../repository/TicketRepository';
import { OrderRepository } from '../../repository/OrderRepository';

export class GetOrderTicketsUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(orderId: string, userId: string): Promise<Ticket[]> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized to view these tickets');
    }

    const tickets = await this.ticketRepository.findByOrderId(orderId);
    return tickets;
  }
}
