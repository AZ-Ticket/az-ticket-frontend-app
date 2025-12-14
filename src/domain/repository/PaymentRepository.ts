export interface PaymentRepository {

    create(
        orderId: string,
        amount: number,
        description: string
    ): Promise<void>;
}