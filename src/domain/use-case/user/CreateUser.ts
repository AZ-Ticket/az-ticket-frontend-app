import { User } from '../../model/User';
import { UserRepository } from '../../repository/UserRepository';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await this.userRepository.create(userData);
    return user;
  }
}
