import { User } from '../../model/User';
import { UserRepository } from '../../repository/UserRepository';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, updateData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new Error('User not found');
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error('Email already in use by another user');
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    return updatedUser;
  }
}
