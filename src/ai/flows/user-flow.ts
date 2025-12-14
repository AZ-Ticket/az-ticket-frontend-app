'use server';
/**
 * @fileOverview A flow to manage user data in Firestore.
 *
 * - getOrCreateUser - A function that gets or creates a user in Firestore.
 * - UserFlowInput - The input type for the getOrCreateUser function.
 * - UserFlowOutput - The return type for the getOrCreateUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore';
import {initializeFirebase} from '@/firebase/app';

const UserFlowInputSchema = z.object({
    userId: z.string().describe('The unique ID of the user from Firebase Authentication.'),
    email: z.string().describe('The email of the user.'),
    name: z.string().optional().describe('The name of the user.'),
});
export type UserFlowInput = z.infer<typeof UserFlowInputSchema>;

const UserFlowOutputSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    role: z.enum(['attendee', 'organizer']),
});
export type UserFlowOutput = z.infer<typeof UserFlowOutputSchema>;

// This is the exported function that will be called from the app.
export async function getOrCreateUser(input: UserFlowInput): Promise<UserFlowOutput> {
    return getOrCreateUserFlow(input);
}

const getOrCreateUserFlow = ai.defineFlow(
    {
        name: 'getOrCreateUserFlow',
        inputSchema: UserFlowInputSchema,
        outputSchema: UserFlowOutputSchema,
    },
    async (input) => {
        const {firestore} = initializeFirebase();
        const userDocRef = doc(firestore, 'users', input.userId);

        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                id: userDoc.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
            };
        } else {
            const newUser = {
                name: input.name || input.email.split('@')[0],
                email: input.email,
                role: 'attendee' as const,
                registrationDate: serverTimestamp(),
            };
            await setDoc(userDocRef, newUser);
            return {
                id: userDocRef.id,
                ...newUser
            };
        }
    }
);
