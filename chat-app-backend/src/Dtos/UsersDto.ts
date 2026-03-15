import { UserRole } from "../Models/User";

export default interface UsersResponseDto {
    id: number; // user ID 

    // User Information Dto
    userName: string;
    firstName: string;
    middleName?: string,
    lastName: string;
    email: string,
    avatar: string,

    // Security Information to Users Account
    isVerified: boolean,
    isBlocked: boolean,
    isDeleted: boolean,
    role: UserRole,

    // Address Information to Users Account
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    country?: string,

    // User Status Preferences
    isOnline: boolean,
    statusMessage?: string
    lastSeen?: Date
    lastLogin?: Date,

    // User Account Preferences
    friends?: number[],
    blockedUsers?: number[],
    preferences?: Record<string, any>,

    // User System TimeStamps
    createdAt: Date,
    updatedAt?: Date,
}