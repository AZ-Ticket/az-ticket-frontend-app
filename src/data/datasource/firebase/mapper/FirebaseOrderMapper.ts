import type {OrderFirebaseDto} from "@/data/datasource/firebase/dto/OrderFirebaseDto";
import type {Order} from "@/domain/model/Order";

export const FirebaseOrderMapper = {
    toDomain(dto: OrderFirebaseDto): Order {
        return {
            id: dto.id,
            userId: dto.userId,
            eventId: dto.eventId,
            quantity: dto.quantity,
            totalAmount: dto.totalAmount,
            status: dto.status,
            paymentMethod: dto.paymentMethod,
            paymentStatus: dto.paymentStatus,
            transactionId: dto.transactionId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        };
    },

    toDto(order: Order): OrderFirebaseDto {
        return {
            id: order.id,
            userId: order.userId,
            eventId: order.eventId,
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            transactionId: order.transactionId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    },
};

export default FirebaseOrderMapper;
