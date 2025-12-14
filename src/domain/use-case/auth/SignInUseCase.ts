import {User} from '../../model/User';
import {AuthRepository} from '../../repository/AuthRepository';

export class SignInUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        return await this.authRepository.signIn(email, password);
    }
}
