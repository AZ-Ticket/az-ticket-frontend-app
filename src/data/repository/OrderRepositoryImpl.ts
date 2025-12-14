import {Order} from '@/src/domain/model/Order';
import {OrderRepository} from '@/src/domain/repository/OrderRepository';
import {OrderFirebaseDataSource} from "@/src/data/datasource/firebase/OrderFirebaseDataSource";

export class OrderRepositoryImpl implements OrderRepository {

    constructor(private dataSource: OrderFirebaseDataSource) {
    }

    async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        return this.dataSource.create(order);
    }

    async findById(id: string): Promise<Order | null> {
        return this.dataSource.findById(id);
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return this.dataSource.findByUserId(userId);
    }

    async findByEventId(eventId: string): Promise<Order[]> {
        return this.dataSource.findByEventId(eventId);
    }

    async findByStatus(status: Order['status']): Promise<Order[]> {
        return this.dataSource.findByStatus(status);
    }

    async findAll(): Promise<Order[]> {
        return this.dataSource.findAll();
    }

    async update(id: string, order: Partial<Order>): Promise<Order> {
        return this.dataSource.update(id, order);
    }

    async updateStatus(id: string, status: Order['status']): Promise<Order> {
        return this.dataSource.updateStatus(id, status);
    }

    async updatePaymentStatus(
        id: string,
        paymentStatus: Order['paymentStatus'],
        transactionId?: string
    ): Promise<Order> {
        return this.dataSource.updatePaymentStatus(id, paymentStatus, transactionId);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }
}
