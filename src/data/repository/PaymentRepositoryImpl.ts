import {PaymentRepository} from "@/src/domain/repository/PaymentRepository";

export class PaymentRepositoryImpl implements PaymentRepository {

    async create(orderId: string, amount: number, description: string): Promise<void> {
        const response = await fetch('https://api.abacatepay.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount
            })
        });

        if (!response.ok) {
            throw new Error(`Payment failed: ${response.statusText}`);
        }
    }
}