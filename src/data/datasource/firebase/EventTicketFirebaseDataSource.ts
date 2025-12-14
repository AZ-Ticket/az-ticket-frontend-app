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
    writeBatch,
    Timestamp,
    Firestore,
} from 'firebase/firestore';
import {EventTicketFirebaseDto} from "@/data/datasource/firebase/dto/EventTicketFirebaseDto";

export class EventTicketFirebaseDataSource {
    private collectionName = 'eventTickets';

    constructor(private db: Firestore) {
    }

    async create(event: Omit<EventTicketFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventTicketFirebaseDto> {
        const eventTicketRef = doc(collection(this.db, this.collectionName));
        const now = Timestamp.now();

        const newEventTicket: EventTicketFirebaseDto = {
            ...event,
            id: eventTicketRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(eventTicketRef, {
            ...newEventTicket,
            createdAt: now,
            updatedAt: now,
        });

        return newEventTicket;
    }

    async createBatch(eventTickets: Omit<EventTicketFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<EventTicketFirebaseDto[]> {
        const batch = writeBatch(this.db);
        const newEventTickets: EventTicketFirebaseDto[] = [];
        const now = Timestamp.now();

        eventTickets.forEach((eventTicket) => {
            const eventTicketRef = doc(collection(this.db, this.collectionName));
            const newEventTicket: EventTicketFirebaseDto = {
                ...eventTicket,
                id: eventTicketRef.id,
                createdAt: now.toDate(),
                updatedAt: now.toDate(),
            };

            newEventTickets.push(newEventTicket);

            batch.set(eventTicketRef, {
                ...newEventTicket,
                createdAt: now,
                updatedAt: now,
            });
        });

        await batch.commit();

        return newEventTickets;
    }

    async findById(id: string): Promise<EventTicketFirebaseDto | null> {
        const eventTicketRef = doc(this.db, this.collectionName, id);
        const eventTicketSnap = await getDoc(eventTicketRef);

        if (!eventTicketSnap.exists()) {
            return null;
        }

        const data = eventTicketSnap.data();
        return {
            id: eventTicketSnap.id,
            eventId: data.eventId,
            description: data.description,
            price: data.price,
            quantity: data.initialQuantity,
            available: data.currentQuantity,
            availableUntil: data.availableUntil?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findByEventId(eventId: String): Promise<EventTicketFirebaseDto[]> {
        const eventTicketsRef = collection(this.db, this.collectionName);
        const q = query(eventTicketsRef, where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                eventId: data.eventId,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                available: data.available,
                availableUntil: data.availableUntil?.toDate(),
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async update(id: string, eventTicket: Partial<EventTicketFirebaseDto>): Promise<EventTicketFirebaseDto> {
        const eventTicketRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData: any = {
            ...eventTicket,
            updatedAt: now,
        };

        if (eventTicket.availableUntil) {
            updateData.availableUntil = Timestamp.fromDate(eventTicket.availableUntil);
        }

        await updateDoc(eventTicketRef, updateData);

        const updatedEvent = await this.findById(id);
        if (!updatedEvent) {
            throw new Error('Event not found after update');
        }

        return updatedEvent;
    }

    async delete(id: string): Promise<void> {
        const eventTicketRef = doc(this.db, this.collectionName, id);
        await deleteDoc(eventTicketRef);
    }
}
