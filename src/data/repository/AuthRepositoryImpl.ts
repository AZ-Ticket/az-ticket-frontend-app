import {User} from '@/src/domain/model/User';
import {AuthRepository} from '@/src/domain/repository/AuthRepository';
import {AuthFirebaseDataSource} from "@/src/data/datasource/firebase/AuthFirebaseDataSource";

export class AuthRepositoryImpl implements AuthRepository {

    constructor(private dataSource: AuthFirebaseDataSource) {
    }

    async signUp(
        email: string,
        password: string,
        name: string,
        phoneNumber?: string
    ): Promise<User> {
        return await this.dataSource.signUp(email, password, name, phoneNumber);
    }

    async signIn(email: string, password: string): Promise<User> {
        return await this.dataSource.signIn(email, password);
    }

    async signWithGoogle(): Promise<User> {
        return await this.dataSource.signWithGoogle();
    }

    async signOut(): Promise<void> {
        return await this.dataSource.signOut();
    }

    async getCurrentUser(): Promise<User | null> {
        return await this.dataSource.getCurrentUser();
    }

    async resetPassword(email: string): Promise<void> {
        return await this.dataSource.resetPassword(email);
    }

    async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
        return await this.dataSource.updatePassword(currentPassword, newPassword);
    }

    async verifyEmail(code: string): Promise<void> {
        return await this.dataSource.verifyEmail(code);
    }

    async refreshToken(): Promise<string> {
        return await this.dataSource.refreshToken();
    }
}
