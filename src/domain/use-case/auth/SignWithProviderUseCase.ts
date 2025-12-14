import {AuthRepository} from "@/domain/repository/AuthRepository";
import {User} from "@/domain/model/User";

export class SignWithProviderUseCase {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<User> {
        return await this.authRepository.signWithGoogle();
    }
}