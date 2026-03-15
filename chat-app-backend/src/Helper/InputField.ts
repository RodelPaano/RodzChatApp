import { UserRole } from '../Models/User';

export interface CreateUserInput {
    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    password: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    preferences: Record<string, any>;
    role: string;
}

export const validateCreateUserInput = (input: CreateUserInput): CreateUserInput => {
    // Sanitize and validate each field
    const sanitized: CreateUserInput = {
        userName: input.userName?.trim() || '',
        firstName: input.firstName?.trim() || '',
        middleName: input.middleName?.trim() || '',
        lastName: input.lastName?.trim() || '',
        email: input.email?.trim().toLowerCase() || '',
        phoneNumber: input.phoneNumber?.trim() || '',
        avatar: input.avatar?.trim() || '',
        password: input.password || '',
        address: input.address?.trim() || '',
        city: input.city?.trim() || '',
        state: input.state?.trim() || '',
        zipCode: input.zipCode?.trim() || '',
        country: input.country?.trim() || '',
        preferences: input.preferences || {},
        role: input.role?.trim() || 'user',
    };

    // Basic validations
    if (!sanitized.userName) throw new Error('Username is required');
    if (!sanitized.firstName) throw new Error('First name is required');
    if (!sanitized.lastName) throw new Error('Last name is required');
    if (!sanitized.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) throw new Error('Valid email is required');
    if (!sanitized.password || sanitized.password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!Object.values(UserRole).includes(sanitized.role as UserRole)) sanitized.role = 'user';

    return sanitized;
};


export const loginInput = (email: string, password: string): { email: string; password: string } => {
    return { email, password }
};

export const updateUserInput = (input: any): any => {
    // Sanitize and validate each field
    const sanitized: any = {
        userName: input.userName?.trim() || null,
        firstName: input.firstName?.trim() || null,
        middleName: input.middleName?.trim() || null,
        lastName: input.lastName?.trim() || null,
        email: input.email?.trim().toLowerCase() || null,
        phoneNumber: input.phoneNumber?.trim() || null,
        avatar: input.avatar?.trim() || null,
        address: input.address?.trim() || null,
        city: input.city?.trim() || null,
        state: input.state?.trim() || null,
        zipCode: input.zipCode?.trim() || null,
        country: input.country?.trim() || null,
        preferences: input.preferences || null,
        role: input.role?.trim() || null,
    };

    return sanitized;
};

export const UpdateUserRole = (id: number, role: string): { id: number; role: string } => {
    return { id, role };
};

export const updateUserEmailAndPasswordInput = (id: number, email: string, password: string): { id: number,email: string; password: string } => {
    return { id ,email, password };
}