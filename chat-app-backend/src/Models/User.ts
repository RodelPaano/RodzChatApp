export default class Users {
    id!: number; // Primary Key

    // User Information
    userName!: string;
    firstName!: string;
    middleName!: string;
    lastName!: string;
    email!: string;
    phoneNumber!: string;
    avatar!: string;

    // Security Information to Users Account
     password!: string;
     isVerified!: boolean;
     isBlocked!: boolean;
     isDeleted!: boolean;
     role!: UserRole;

    // Address Information
    address!: string;
    city!: string;
    state!: string;
    zipCode!: string;
    country!: string;

    // Chat Preferences
    isOnline!: boolean;
    statusMessage!: MessageStatus;
    lastSeen!: Date;
    lastLogin! : Date;

    // Social Features
    friends!: number[];
    blockedUsers!: number[];

    // Preferences Theme or Languages, Notification
    preferences!: Record<string, any>;

    // System TimeStamps
    createdAt!: Date;
    updatedAt!: Date

    constructor (
        id: number,
        userName: string,
        firstName: string,
        middleName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        avatar: string,
        password: string,
        isVerified: boolean,
        isBlocked: boolean,
        isDeleted: boolean,
        role: UserRole,
        address: string,
        city: string,
        state: string,
        zipCode: string,        
        country: string,
        isOnline: boolean,
        statusMessage: MessageStatus,
        lastSeen: Date,
        lastLogin: Date,
        friends: number[],
        blockedUsers: number[],
        preferences: Record<string, any>,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.password = password;
        this.isVerified = isVerified;
        this.isBlocked = isBlocked;
        this.isDeleted = isDeleted;
        this.role = role;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.isOnline = isOnline;
        this.statusMessage = statusMessage;
        this.lastSeen = lastSeen;
        this.lastLogin = lastLogin;
        this.friends = friends;
        this.blockedUsers = blockedUsers;
        this.preferences = preferences;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export enum UserRole {
    user = "user",
    admin = "admin",
    moderator  = "moderator",
    bot = "bot",
    premium = "premium"
}

export enum MessageStatus {
    sent = "sent",
    delivered = "delivered",
    read = "read",
    seen = "seen",
    failed = "failed"
}