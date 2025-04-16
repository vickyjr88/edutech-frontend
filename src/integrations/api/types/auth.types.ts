// src/api/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
    [key: string]: any; // For any additional properties
}

export interface Session {
    user: User;
    token: string;
    expiresAt?: number;
}