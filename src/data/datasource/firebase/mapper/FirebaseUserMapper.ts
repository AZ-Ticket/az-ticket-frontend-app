import type {UserFirebaseDto} from "@/data/datasource/firebase/dto/UserFirebaseDto";
import type {User} from "@/domain/model/User";

export const FirebaseUserMapper = {
    toDomain(dto: UserFirebaseDto): User {
        return {
            id: dto.id,
            email: dto.email,
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            role: dto.role,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    },

    toDto(user: User): UserFirebaseDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
};

export default FirebaseUserMapper;
