import {
    Auth, AuthError,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import {doc, Firestore, getDoc, setDoc, Timestamp} from 'firebase/firestore';
import {UserFirebaseDto} from "@/data/datasource/firebase/dto/UserFirebaseDto";

export class AuthFirebaseDataSource {
    private collectionName = 'users';

    constructor(private auth: Auth, private db: Firestore) {
    }

    async signUp(
        email: string,
        password: string,
        name: string,
        phoneNumber?: string
    ): Promise<UserFirebaseDto> {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const firebaseUser = userCredential.user;

        if (!firebaseUser.uid) {
            throw new Error('Failed to create user: UID not generated');
        }

        const now = Timestamp.now();
        const newUser: UserFirebaseDto = {
            id: firebaseUser.uid,
            email: email,
            name,
            phoneNumber,
            role: 'user',
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
        };

        await setDoc(doc(this.db, this.collectionName, firebaseUser.uid), {
            email: newUser.email,
            name: newUser.name,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            createdAt: now,
            updatedAt: now,
        });

        await sendEmailVerification(firebaseUser);

        return newUser;
    }

    async signIn(email: string, password: string): Promise<UserFirebaseDto> {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const firebaseUser = userCredential.user;

        const userDoc = await
            getDoc(doc(this.db, this.collectionName, firebaseUser.uid));

        if (!userDoc.exists()) {
            throw new Error('User data not found');
        }

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

    async signWithGoogle(): Promise<UserFirebaseDto> {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(this.auth, provider);
            const firebaseUser = userCredential.user;

            if (!firebaseUser.uid) {
                throw new Error('Failed to sign in with Google: UID not generated');
            }

            const userDoc = await getDoc(doc(this.db, this.collectionName, firebaseUser.uid));

            if (userDoc.exists()) {
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

            const now = Timestamp.now();
            const newUser: UserFirebaseDto = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || '',
                phoneNumber: "",
                role: 'user',
                createdAt: now.toDate(),
                updatedAt: now.toDate(),
            };

            await setDoc(doc(this.db, this.collectionName, firebaseUser.uid), {
                email: newUser.email,
                name: newUser.name,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                createdAt: now,
                updatedAt: now,
            });

            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async signOut(): Promise<void> {
        await firebaseSignOut(this.auth);
    }

    async getCurrentUser(): Promise<UserFirebaseDto | null> {
        const firebaseUser = this.auth.currentUser;

        if (!firebaseUser) {
            return null;
        }

        const userDoc = await getDoc(doc(this.db, this.collectionName, firebaseUser.uid));

        if (!userDoc.exists()) {
            return null;
        }

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

    async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(this.auth, email);
    }

    async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
        const user = this.auth.currentUser;

        if (!user || !user.email) {
            throw new Error('No user is currently signed in');
        }

        await signInWithEmailAndPassword(this.auth, user.email, currentPassword);
        await firebaseUpdatePassword(user, newPassword);
    }

    async verifyEmail(code: string): Promise<void> {
        throw new Error('Email verification with code not implemented. Use Firebase email verification links. ' + code);
    }

    async refreshToken(): Promise<string> {
        const user = this.auth.currentUser;

        if (!user) {
            throw new Error('No user is currently signed in');
        }

        return await user.getIdToken(true);
    }

    getFirebaseErrorMessage = (error: AuthError) => {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'O formato do e-mail é inválido.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'E-mail ou senha incorretos.';
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso.';
            case 'auth/weak-password':
                return 'A senha é muito fraca. Tente uma mais forte.';
            case 'auth/popup-closed-by-user':
                return 'A janela de autenticação foi fechada. Tente novamente.';
            default:
                return 'Ocorreu um erro. Por favor, tente novamente.';
        }
    }
}
