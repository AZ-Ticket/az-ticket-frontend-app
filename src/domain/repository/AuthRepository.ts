import {User} from '../model/User';

export interface AuthRepository {
    signUp(email: string, password: string, name: string, phoneNumber?: string): Promise<User>;

    signIn(email: string, password: string): Promise<User>;

    signWithGoogle(): Promise<User>;

    signOut(): Promise<void>;

    getCurrentUser(): Promise<User | null>;

    resetPassword(email: string): Promise<void>;

    updatePassword(currentPassword: string, newPassword: string): Promise<void>;

    verifyEmail(code: string): Promise<void>;

    refreshToken(): Promise<string>;
}