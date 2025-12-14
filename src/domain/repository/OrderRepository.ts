import {Order} from '../model/Order';

export interface OrderRepository {
    create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;

    findById(id: string): Promise<Order | null>;

    findByUserId(userId: string): Promise<Order[]>;

    findByEventId(eventId: string): Promise<Order[]>;

    findByStatus(status: Order['status']): Promise<Order[]>;

    findAll(): Promise<Order[]>;

    update(id: string, order: Partial<Order>): Promise<Order>;

    updateStatus(id: string, status: Order['status']): Promise<Order>;

    updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus'], transactionId?: string): Promise<Order>;

    delete(id: string): Promise<void>;
}
