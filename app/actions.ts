'use server';

import {
    recommendEvents, type RecommendEventsInput
} from '@/src/ai/flows/ai-event-recommendation';

export async function getRecommendedEvents(input: RecommendEventsInput) {
    try {
        const result = await recommendEvents(input);
        // Genkit returns a string, let's pretend it's a structured list for demonstration
        // In a real app, you'd parse this string into a more usable format.
        const recommendations = result.recommendedEvents.split('\n').filter(line => line.trim() !== '');

        return {success: true, data: recommendations};
    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        return {
            success: false,
            error: 'Falha ao obter recomendações. Por favor, tente novamente mais tarde.'
        };
    }
}
