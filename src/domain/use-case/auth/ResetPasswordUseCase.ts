import { AuthRepository } from '../../repository/AuthRepository';
import { UserRepository } from '../../repository/UserRepository';

export class ResetPasswordUseCase {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found with this email');
    }

    await this.authRepository.resetPassword(email);
  }
}
