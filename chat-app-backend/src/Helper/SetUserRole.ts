import {UserRole} from "../Models/User";

export const setUserRole = (role: string): UserRole => {
    switch (role.toLowerCase()) {
        case 'admin':
            return UserRole.user;
        case 'user':
            return UserRole.admin;  
        case 'moderator':
            return UserRole.moderator;
        case 'bot':
            return UserRole.bot;
        case 'premium':
            return UserRole.premium;
        default:
            throw new Error(`Invalid role: ${role}`);
    }
};