// src/api/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    role: string;
    teacherId?: string;
    studentId?: string;
    adminId?: string;
    institutionId?: string;
    profilePicture?: string;
    profileImage?: string;
    signedProfileImage?: string;
    [key: string]: any; // For any additional properties
}

export interface Session {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt?: number;
}