import { Media } from "../Models/Rooms";

export default interface MessagesResponseDto {
    id: number;     //Primary Key
    roomId: number;  // Foreign Key to ChatRooms
    senderId: number;  //Foreign Key to Users
    receiverId?: number;  // Foreign Key to Users

    // Message Information
    roomName?: string;
    message: string;
    senderName: string;
    media?: Media[];
    receiverName: string;

    // Timestamps 
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    receivedAt?: Date;
    readAt?: Date;
    replyAt?: Date;

    // Reply Linkage Information

    replyToMessageId?: string;
    
}