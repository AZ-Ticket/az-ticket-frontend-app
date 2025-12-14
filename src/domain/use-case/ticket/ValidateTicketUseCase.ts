import { Ticket } from '../../model/Ticket';
import { TicketRepository } from '../../repository/TicketRepository';

export class ValidateTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(qrCode: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findByQrCode(qrCode);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.status === 'used') {
      throw new Error('Ticket has already been used');
    }

    if (ticket.status === 'cancelled') {
      throw new Error('Ticket has been cancelled');
    }

    if (ticket.status === 'expired') {
      throw new Error('Ticket has expired');
    }

    const validatedTicket = await this.ticketRepository.validateTicket(ticket.id);
    return validatedTicket;
  }
}
