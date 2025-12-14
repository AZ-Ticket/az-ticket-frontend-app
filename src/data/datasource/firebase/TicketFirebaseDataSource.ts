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
    Timestamp,
    writeBatch, Firestore,
} from 'firebase/firestore';
import {TicketFirebaseDto} from "@/data/datasource/firebase/dto/TicketFirebaseDto";

export class TicketFirebaseDataSource {
    private collectionName = 'tickets';

    constructor(private db: Firestore) {
    }

    async create(ticket: Omit<TicketFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<TicketFirebaseDto> {
        const ticketRef = doc(collection(this.db, this.collectionName));
        const now = Timestamp.now();

        const newTicket: TicketFirebaseDto = {
            ...ticket,
            id: ticketRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(ticketRef, {
            ...newTicket,
            validatedAt: ticket.validatedAt ? Timestamp.fromDate(ticket.validatedAt) : null,
            createdAt: now,
            updatedAt: now,
        });

        return newTicket;
    }

    async createBatch(tickets: Omit<TicketFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<TicketFirebaseDto[]> {
        const batch = writeBatch(this.db);
        const now = Timestamp.now();
        const newTickets: TicketFirebaseDto[] = [];

        for (const ticket of tickets) {
            const ticketRef = doc(collection(this.db, this.collectionName));
            const newTicket: TicketFirebaseDto = {
                ...ticket,
                id: ticketRef.id,
                createdAt: now.toDate(),
                updatedAt: now.toDate(),
            };

            batch.set(ticketRef, {
                ...newTicket,
                validatedAt: ticket.validatedAt ? Timestamp.fromDate(ticket.validatedAt) : null,
                createdAt: now,
                updatedAt: now,
            });

            newTickets.push(newTicket);
        }

        await batch.commit();
        return newTickets;
    }

    async findById(id: string): Promise<TicketFirebaseDto | null> {
        const ticketRef = doc(this.db, this.collectionName, id);
        const ticketSnap = await getDoc(ticketRef);

        if (!ticketSnap.exists()) {
            return null;
        }

        const data = ticketSnap.data();
        return {
            id: ticketSnap.id,
            eventId: data.eventId,
            eventTicketId: data.eventTicketId,
            orderId: data.orderId,
            ticketNumber: data.ticketNumber,
            seatNumber: data.seatNumber,
            status: data.status,
            qrCode: data.qrCode,
            validatedAt: data.validatedAt?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findByOrderId(orderId: string): Promise<TicketFirebaseDto[]> {
        const ticketsRef = collection(this.db, this.collectionName);
        const q = query(ticketsRef, where('orderId', '==', orderId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                eventId: data.eventId,
                eventTicketId: data.eventTicketId,
                orderId: data.orderId,
                ticketNumber: data.ticketNumber,
                seatNumber: data.seatNumber,
                status: data.status,
                qrCode: data.qrCode,
                validatedAt: data.validatedAt?.toDate(),
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByEventId(eventId: string): Promise<TicketFirebaseDto[]> {
        const ticketsRef = collection(this.db, this.collectionName);
        const q = query(ticketsRef, where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                eventId: data.eventId,
                eventTicketId: data.eventTicketId,
                orderId: data.orderId,
                ticketNumber: data.ticketNumber,
                seatNumber: data.seatNumber,
                status: data.status,
                qrCode: data.qrCode,
                validatedAt: data.validatedAt?.toDate(),
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByTicketNumber(ticketNumber: string): Promise<TicketFirebaseDto | null> {
        const ticketsRef = collection(this.db, this.collectionName);
        const q = query(ticketsRef, where('ticketNumber', '==', ticketNumber));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const ticketDoc = querySnapshot.docs[0];
        const data = ticketDoc.data();

        return {
            id: ticketDoc.id,
            eventId: data.eventId,
            eventTicketId: data.eventTicketId,
            orderId: data.orderId,
            ticketNumber: data.ticketNumber,
            seatNumber: data.seatNumber,
            status: data.status,
            qrCode: data.qrCode,
            validatedAt: data.validatedAt?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findByQrCode(qrCode: string): Promise<TicketFirebaseDto | null> {
        const ticketsRef = collection(this.db, this.collectionName);
        const q = query(ticketsRef, where('qrCode', '==', qrCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const ticketDoc = querySnapshot.docs[0];
        const data = ticketDoc.data();

        return {
            id: ticketDoc.id,
            eventId: data.eventId,
            eventTicketId: data.eventTicketId,
            orderId: data.orderId,
            ticketNumber: data.ticketNumber,
            seatNumber: data.seatNumber,
            status: data.status,
            qrCode: data.qrCode,
            validatedAt: data.validatedAt?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async update(id: string, ticket: Partial<TicketFirebaseDto>): Promise<TicketFirebaseDto> {
        const ticketRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData: any = {
            ...ticket,
            updatedAt: now,
        };

        if (ticket.validatedAt) {
            updateData.validatedAt = Timestamp.fromDate(ticket.validatedAt);
        }

        await updateDoc(ticketRef, updateData);

        const updatedTicket = await this.findById(id);
        if (!updatedTicket) {
            throw new Error('Ticket not found after update');
        }

        return updatedTicket;
    }

    async updateStatus(id: string, status: TicketFirebaseDto['status']): Promise<TicketFirebaseDto> {
        const ticketRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        await updateDoc(ticketRef, {
            status,
            updatedAt: now,
        });

        const updatedTicket = await this.findById(id);
        if (!updatedTicket) {
            throw new Error('Ticket not found after update');
        }

        return updatedTicket;
    }

    async validateTicket(id: string): Promise<TicketFirebaseDto> {
        const ticketRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        await updateDoc(ticketRef, {
            status: 'used',
            validatedAt: now,
            updatedAt: now,
        });

        const validatedTicket = await this.findById(id);
        if (!validatedTicket) {
            throw new Error('Ticket not found after validation');
        }

        return validatedTicket;
    }

    async delete(id: string): Promise<void> {
        const ticketRef = doc(this.db, this.collectionName, id);
        await deleteDoc(ticketRef);
    }
}
