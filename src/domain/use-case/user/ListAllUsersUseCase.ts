import { User } from '../../model/User';
import { UserRepository } from '../../repository/UserRepository';

export class ListAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }
}
