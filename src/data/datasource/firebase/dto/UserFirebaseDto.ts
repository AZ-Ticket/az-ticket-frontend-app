export interface UserFirebaseDto {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}
