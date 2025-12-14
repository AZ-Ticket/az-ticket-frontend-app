export interface EventFirebaseDto {
    id: string;
    title: string;
    description: string;
    venue: string;
    address: string;
    date: Date;
    time: string;
    imageUrl?: string;
    category: string;
    organizerId: string;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
