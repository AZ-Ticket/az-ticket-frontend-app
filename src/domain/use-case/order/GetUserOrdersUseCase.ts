import { Order } from '../../model/Order';
import { OrderRepository } from '../../repository/OrderRepository';

export class GetUserOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.findByUserId(userId);
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
