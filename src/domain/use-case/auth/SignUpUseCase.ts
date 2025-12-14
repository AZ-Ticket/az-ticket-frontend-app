import {User} from '../../model/User';
import {AuthRepository} from '../../repository/AuthRepository';
import {UserRepository} from '../../repository/UserRepository';

export class SignUpUseCase {
    constructor(
        private authRepository: AuthRepository,
        private userRepository: UserRepository
    ) { }

    async execute(
        email: string,
        password: string,
        name: string,
        phoneNumber?: string
    ): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        return await this.authRepository.signUp(email, password, name, phoneNumber);
    }
}
