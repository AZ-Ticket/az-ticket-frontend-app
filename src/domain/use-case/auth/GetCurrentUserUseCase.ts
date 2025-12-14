import {User} from '@/domain/model/User';
import {AuthRepository} from '@/domain/repository/AuthRepository';

export class GetCurrentUserUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<User | null> {
        return await this.authRepository.getCurrentUser();
    }
}
