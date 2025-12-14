import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp, Firestore,
} from 'firebase/firestore';
import {OrderFirebaseDto} from "@/data/datasource/firebase/dto/OrderFirebaseDto";

export class OrderFirebaseDataSource {
    private collectionName = 'orders';

    constructor(private db: Firestore) {
    }

    async create(order: Omit<OrderFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderFirebaseDto> {
        const orderRef = doc(collection(this.db, this.collectionName));
        const now = Timestamp.now();

        const newOrder: OrderFirebaseDto = {
            ...order,
            id: orderRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(orderRef, {
            ...newOrder,
            createdAt: now,
            updatedAt: now,
        });

        return newOrder;
    }

    async findById(id: string): Promise<OrderFirebaseDto | null> {
        const orderRef = doc(this.db, this.collectionName, id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return null;
        }

        const data = orderSnap.data();
        return {
            id: orderSnap.id,
            userId: data.userId,
            eventId: data.eventId,
            quantity: data.quantity,
            totalAmount: data.totalAmount,
            status: data.status,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            transactionId: data.transactionId,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findByUserId(userId: string): Promise<OrderFirebaseDto[]> {
        const ordersRef = collection(this.db, this.collectionName);
        const q = query(ordersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                quantity: data.quantity,
                totalAmount: data.totalAmount,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                transactionId: data.transactionId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByEventId(eventId: string): Promise<OrderFirebaseDto[]> {
        const ordersRef = collection(this.db, this.collectionName);
        const q = query(ordersRef, where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                quantity: data.quantity,
                totalAmount: data.totalAmount,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                transactionId: data.transactionId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByStatus(status: OrderFirebaseDto['status']): Promise<OrderFirebaseDto[]> {
        const ordersRef = collection(this.db, this.collectionName);
        const q = query(ordersRef, where('status', '==', status));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                quantity: data.quantity,
                totalAmount: data.totalAmount,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                transactionId: data.transactionId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findAll(): Promise<OrderFirebaseDto[]> {
        const ordersRef = collection(this.db, this.collectionName);
        const querySnapshot = await getDocs(ordersRef);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                quantity: data.quantity,
                totalAmount: data.totalAmount,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                transactionId: data.transactionId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async update(id: string, order: Partial<OrderFirebaseDto>): Promise<OrderFirebaseDto> {
        const orderRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData = {
            ...order,
            updatedAt: now,
        };

        await updateDoc(orderRef, updateData);

        const updatedOrder = await this.findById(id);
        if (!updatedOrder) {
            throw new Error('Order not found after update');
        }

        return updatedOrder;
    }

    async updateStatus(id: string, status: OrderFirebaseDto['status']): Promise<OrderFirebaseDto> {
        const orderRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        await updateDoc(orderRef, {
            status,
            updatedAt: now,
        });

        const updatedOrder = await this.findById(id);
        if (!updatedOrder) {
            throw new Error('Order not found after update');
        }

        return updatedOrder;
    }

    async updatePaymentStatus(
        id: string,
        paymentStatus: OrderFirebaseDto['paymentStatus'],
        transactionId?: string
    ): Promise<OrderFirebaseDto> {
        const orderRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData: any = {
            paymentStatus,
            updatedAt: now,
        };

        if (transactionId) {
            updateData.transactionId = transactionId;
        }

        await updateDoc(orderRef, updateData);

        const updatedOrder = await this.findById(id);
        if (!updatedOrder) {
            throw new Error('Order not found after update');
        }

        return updatedOrder;
    }

    async delete(id: string): Promise<void> {
        const orderRef = doc(this.db, this.collectionName, id);
        await deleteDoc(orderRef);
    }
}
