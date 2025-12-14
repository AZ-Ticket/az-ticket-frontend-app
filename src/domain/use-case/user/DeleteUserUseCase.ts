import { UserRepository } from '../../repository/UserRepository';
import { OrderRepository } from '../../repository/OrderRepository';

export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const userOrders = await this.orderRepository.findByUserId(userId);
    const hasActiveOrders = userOrders.some(
      order => order.status === 'confirmed' || order.status === 'pending'
    );

    if (hasActiveOrders) {
      throw new Error('Cannot delete user with active orders');
    }

    await this.userRepository.delete(userId);
  }
}
