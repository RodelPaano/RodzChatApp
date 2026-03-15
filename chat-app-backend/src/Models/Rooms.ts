import UsersChatRooms from "./UsersChatRooms";

export interface Media {
    id: string; // Primary Key
    messageId: number, // Foreign for Message
    roomId: number, // Foreign for Rooms

    // Message Information
    type: "image" | "video" | "audio" | "file" | "link";
    url: string;
    uploadedBy: number;
    uploadedAt: Date;

}

export default class ChatRooms {
    id!: string;

    // Rooms Information
    name!: string;
    description!: string;
    icon?: string;
    ownerId!: number; // Foreign Key to Users Models
    members!: UsersChatRooms[];  // Belong to many Users

    media!: Media[]; // Belong and List of Media

    // System TimeStamps
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date | null;

    constructor (
        id: string,
        name: string,
        description: string,
        icon?: string,
        ownerId?: number,
        members: UsersChatRooms[] = [],
        media: Media[] = [],
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date | null,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon || "";
        this.ownerId = ownerId || 0;
        this.members = members || [];
        this.media = media || [];
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.deletedAt = deletedAt || null;
    }
}