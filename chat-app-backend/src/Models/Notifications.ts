export enum NotificationType {
    FRIEND_REQUEST = "friend_request",
    FRIEND_ACCEPTED = "friend_accepted",
    FRIEND_REJECTED = "friend_rejected",

    // Message received
    MESSAGE = "message",
    GROUP_MESSAGE = "group_message",
    // Room invitations
    ROOM_INVITE = "room_invite",

    // Group Chat Invitations
    GROUP_CHAT_INVITE = "group_chat_invite",
    
    REACTION = "reaction",
    MENTION = "mention",
    SYSTEM_ALERT = "system_alert",
    OTHER = "other",
}

export default class Notifications {

    id!: number; // Primary Key

    receiverId!: number; // Foreign Key to Users
    senderId!: number; // Foreign Key to Users (optional for system notifications)

    type!: NotificationType; // Type of notification
    content!: string; // Notification message content
    isRead!: boolean; // Read status

    image?: string;

    roomId?: string | null; // Optional Foreign Key to ChatRooms (for room-related notifications)
    messageId?: number | null; // Optional Foreign Key to Messages (for message-related notifications)
    
    link!: string;

    createdAt!: Date; // Timestamp of when the notification was created
    updatedAt!: Date

    constructor (
        id: number,
        receiverId: number,
        senderId: number,
        type: NotificationType,
        content: string,
        link: string,
        createdAt: Date,
        updatedAt: Date,
        isRead: boolean = false,
        image?: string,
        roomId?: string | null,
        messageId?: number | null
    ) {
        this.id = id;
        this.receiverId = receiverId;
        this.senderId = senderId;
        this.type = type;
        this.content = content;
        this.link = link;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isRead = isRead;
        this.image = image;
        this.roomId = roomId;
        this.messageId = messageId;
    }

}