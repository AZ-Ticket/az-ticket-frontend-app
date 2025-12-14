import {User} from '@/src/domain/model/User';
import {UserRepository} from '@/src/domain/repository/UserRepository';
import {UserFirebaseDataSource} from "@/src/data/datasource/firebase/UserFirebaseDataSource";

export class UserRepositoryImpl implements UserRepository {

    constructor(private dataSource: UserFirebaseDataSource) {
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return this.dataSource.create(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.dataSource.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.dataSource.findByEmail(email);
    }

    async findAll(): Promise<User[]> {
        return this.dataSource.findAll();
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        return this.dataSource.update(id, user);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }
}
