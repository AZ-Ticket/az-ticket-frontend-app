import { User } from '../../model/User';
import { UserRepository } from '../../repository/UserRepository';

export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
