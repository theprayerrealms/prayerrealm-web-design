export interface IUser {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'VOLUNTEER' | 'MODERATOR' | 'ADMIN';
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    fcmToken?: string;
}

// Note: In Firestore, we don't need a strict schema, 
// but we use this interface for type safety in the controllers.
