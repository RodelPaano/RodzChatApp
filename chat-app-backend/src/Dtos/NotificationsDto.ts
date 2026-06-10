export enum NotificationTypeDto {
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

export default interface NotificationsDto {
    id: number,
    receiverId: number,
    senderId: number,
    type: NotificationTypeDto,
    content: string,
    link: string,
    createdAt: Date,
    updatedAt: Date,
    isRead?: boolean,
    image?: string,
    roomId?: string | null,
    messageId?: number | null
}