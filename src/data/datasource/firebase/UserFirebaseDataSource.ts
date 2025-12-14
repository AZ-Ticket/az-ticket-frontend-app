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
import {UserFirebaseDto} from "@/data/datasource/firebase/dto/UserFirebaseDto";

export class UserFirebaseDataSource {
    private collectionName = 'users';

    constructor(private db: Firestore) {
    }

    async create(user: Omit<UserFirebaseDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserFirebaseDto> {
        const userRef = doc(collection(this.db, this.collectionName));
        const now = Timestamp.now();

        const newUser: UserFirebaseDto = {
            ...user,
            id: userRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(userRef, {
            ...newUser,
            createdAt: now,
            updatedAt: now,
        });

        return newUser;
    }

    async findById(id: string): Promise<UserFirebaseDto | null> {
        const userRef = doc(this.db, this.collectionName, id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return null;
        }

        const data = userSnap.data();
        return {
            id: userSnap.id,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findByEmail(email: string): Promise<UserFirebaseDto | null> {
        const usersRef = collection(this.db, this.collectionName);
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();

        return {
            id: userDoc.id,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    }

    async findAll(): Promise<UserFirebaseDto[]> {
        const usersRef = collection(this.db, this.collectionName);
        const querySnapshot = await getDocs(usersRef);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                name: data.name,
                phoneNumber: data.phoneNumber,
                role: data.role,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    }

    async update(id: string, user: Partial<UserFirebaseDto>): Promise<UserFirebaseDto> {
        const userRef = doc(this.db, this.collectionName, id);
        const now = Timestamp.now();

        const updateData = {
            ...user,
            updatedAt: now,
        };

        await updateDoc(userRef, updateData);

        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        const userRef = doc(this.db, this.collectionName, id);
        await deleteDoc(userRef);
    }
}
