import { Media } from "./Rooms";

export default class Messages {
  id: number;                   // Primary Key
  roomId: number;                // Foreign Key to ChatRooms

  // Message Information
  message: string;              // text content
  senderId: number;              // Foreign Key to Users
  receiverId!: number | null;           // optional for group chats
  media: Media[];               // pictures/videos

  // Timestamps
  createdAt: Date;               // when message was created
  updatedAt?: Date;   
  deletedAt?: Date;           // when message was updated
  receivedAt?: Date;             // when receiver got the message
  readAt?: Date;                 // when receiver read the message
  replyAt?: Date;                // when reply was made

  // Reply linkage
  replyToMessageId?: string | null;     // reference to original message
  constructor (
    id: number,
    roomId: number,
    senderId: number,
    receiverId?: number | null,
    message: string = "", 
    media: Media[] = [],  
    createdAt: Date = new Date(),
    updatedAt?: Date,
    deletedAt?: Date,
    receivedAt?: Date | null,
    readAt?: Date | null,
    replyAt?: Date | null,
    replyToMessageId?: string | null,
  ){
    this.id = id;
    this.roomId = roomId;
    this.senderId = senderId;
    this.receiverId = receiverId || 0;
    this.message = message || "";
    this.media = media || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || new Date(0);
    this.receivedAt = receivedAt || new Date(0);
    this.readAt = readAt || new Date(0);
    this.replyAt = replyAt || new Date(0);
    this.replyToMessageId = replyToMessageId ?? null;
  }
}
