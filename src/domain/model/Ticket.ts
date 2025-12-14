export interface Ticket {
  id: string;
  eventId: string;
  eventTicketId: string;
  orderId: string;
  ticketNumber: string;
  seatNumber?: string;
  status: 'active' | 'used' | 'cancelled' | 'expired';
  qrCode: string;
  validatedAt?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
