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
    Firestore,
} from 'firebase/firestore';
import {EventFirebaseDto} from "@/data/datasource/firebase/dto/EventFirebaseDto";

export class EventFirebaseDataSource {
    private collectionName = 'events';

    constructor(private db: Firestore) {
    }

    async create(event: Omit<EventFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventFirebaseDto> {
        const eventRef = doc(collection(this.db, this.collectionName));
        const now = Timestamp.now();

        const newEvent: EventFirebaseDto = {
            ...event,
            id: eventRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(eventRef, {
            ...newEvent,
            date: Timestamp.fromDate(event.date),
            createdAt: now,
            updatedAt: now,
        });

        return newEvent;
    }

    async findById(id: string): Promise<EventFirebaseDto | null> {
        const eventRef = doc(this.db, this.collectionName, id);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
            return null;
        }

        const data = eventSnap.data();
        return {
            id: eventSnap.id,
            title: data.title,
            description: data.description,
            venue: data.venue,
            address: data.address,
            date: data.date?.toDate() || new Date(),
            time: data.time,
            imageUrl: data.imageUrl,
            category: data.category,
            organizerId: data.organizerId,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findAll(): Promise<EventFirebaseDto[]> {
        const eventsRef = collection(this.db, this.collectionName);
        const querySnapshot = await getDocs(eventsRef);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                venue: data.venue,
                address: data.address,
                date: data.date?.toDate() || new Date(),
                time: data.time,
                imageUrl: data.imageUrl,
                category: data.category,
                totalTickets: data.totalTickets,
                availableTickets: data.availableTickets,
                ticketPrice: data.ticketPrice,
                organizerId: data.organizerId,
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByCategory(category: string): Promise<EventFirebaseDto[]> {
        const eventsRef = collection(this.db, this.collectionName);
        const q = query(eventsRef, where('category', '==', category));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                venue: data.venue,
                address: data.address,
                date: data.date?.toDate() || new Date(),
                time: data.time,
                imageUrl: data.imageUrl,
                category: data.category,
                organizerId: data.organizerId,
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByStatus(status: EventFirebaseDto['status']): Promise<EventFirebaseDto[]> {
        const eventsRef = collection(this.db, this.collectionName);
        const q = query(eventsRef, where('status', '==', status));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                venue: data.venue,
                address: data.address,
                date: data.date?.toDate() || new Date(),
                time: data.time,
                imageUrl: data.imageUrl,
                category: data.category,
                organizerId: data.organizerId,
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async findByOrganizer(organizerId: string): Promise<EventFirebaseDto[]> {
        const eventsRef = collection(this.db, this.collectionName);
        const q = query(eventsRef, where('organizerId', '==', organizerId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                venue: data.venue,
                address: data.address,
                date: data.date?.toDate() || new Date(),
                time: data.time,
                imageUrl: data.imageUrl,
                category: data.category,
                organizerId: data.organizerId,
                status: data.status,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async update(id: string, event: Partial<EventFirebaseDto>): Promise<EventFirebaseDto> {
        const eventRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData: any = {
            ...event,
            updatedAt: now,
        };

        if (event.date) {
            updateData.date = Timestamp.fromDate(event.date);
        }

        await updateDoc(eventRef, updateData);

        const updatedEvent = await this.findById(id);
        if (!updatedEvent) {
            throw new Error('Event not found after update');
        }

        return updatedEvent;
    }

    async delete(id: string): Promise<void> {
        const eventRef = doc(this.db, this.collectionName, id);
        await deleteDoc(eventRef);
    }
}
