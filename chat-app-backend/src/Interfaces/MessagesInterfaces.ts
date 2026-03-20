import Messages from "../Models/Messages";
import MessagesResponseDto from "../Dtos/MessagesDto";
import ChatRooms, { Media } from "../Models/Rooms";

export  interface MessagesAutoMapperInterface {
    mapToModel(dto: MessagesResponseDto) : Messages;
    mapToDto(Model: Messages) : MessagesResponseDto;
}

export interface MessagesRepositoryInterface {
    // Send an Message Post to the database and send back the Message Model
    sendMessage( senderId: number, receiverId: number, message: Messages, mediaFile: Media[] ) : Promise<Messages>;
    sendMultipleMessagesToAllFriends( senderId: number, receiverId: number[], message: Messages, mediaFile: Media[]) : Promise<Messages[]>;
    sendMessageToRoom(roomId: number,  senderId: number, message: Messages, mediaFile: Media[])  : Promise<Messages>;

    // Reply to Message have Sender ID From Receiver Id
    replyToMessageFromReceiverToSender(senderId: number, receiverId: number, message: Messages, replyAt: Date, mediaFile: Media[]) : Promise<Messages[] >;
    replyToMessageFromRoomBySenderToReceivers(roomId: number, senderId: number, message: Messages, replyAt: Date, mediaFile: Media[]) : Promise<Messages[] >;

    // Get Message By Its ID and Return the Message Message to the messageDto
    getMessageBySenderIdToReceiverId(id: number, senderId: number, receiverId: number, readAt: Date) : Promise<( Messages & { media: Media[] } | null)>;
    getMessagesByReceiverId( senderId: number, receiverId: number, readAt: Date, offset: number) : Promise<(Messages[] & { media: Media[] } ) [] >;
    getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, receiverIds: number[], readAt: Date, offset: number) : Promise<(Messages[] & { media: Media[] } ) []>;

    // Delete Or Remove Message By Its ID and return Boolean Message if Successfully removed
    deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]) : Promise<boolean>;
    deleteOrRemoveMessageByRoomId( roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]) : Promise<boolean>;

    // Update Message By Its ID and return the Message Message to the messageDto
    updateMessageById(id: number, senderId: number, receiverId: number, readAt: Date, message: Messages, updatedAt: Date) : Promise<Messages | null>;
    updateMessageByRoomId(id: number, roomId: number, senderId: number, readAt: Date,message: Messages, updatedAt: Date) : Promise<Messages | null>; 
}

export interface MessageServicesInterface {
    // Send an Message Post to the Database and send back the Message Dto
    sendMessage( senderId: number, receiverId: number,  message: Messages, mediaFile: Media[]) : Promise<MessagesResponseDto>;
    sendMultipleMessagesToAllFriends( senderId: number, receiverId: number[], message: Messages, mediaFile: Media[]) : Promise<MessagesResponseDto[]>;
    sendMessageToRoom(roomId: number, senderId: number, message: Messages, mediaFile: Media[]) : Promise<MessagesResponseDto>;

    // Reply to Message have Sender ID From Receiver Id
    replyToMessageFromReceiverToSender(senderId: number, receiverId: number, message: Messages, replyAt: Date, mediaFile: Media[]) : Promise<MessagesResponseDto[] >;
    replyToMessageFromRoomBySenderToReceivers(roomId: number, senderId: number, message: Messages, replyAt: Date, mediaFile: Media[]) : Promise<MessagesResponseDto[] >;

    // Get Message By Its Id and Return the Message MessageDto
    getMessageBySenderIdToReceiverId(id: number,senderId: number, receiverId: number,readAt: Date, mediaFile: Media[]) : Promise<MessagesResponseDto | null>;
    getMessagesByReceiverId(senderId: number, receiverId: number, readAt: Date, offset: number, mediaFile: Media[]) : Promise<MessagesResponseDto[]>;
    getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, receiverIds: number[], readAt: Date, offset: number, mediaFile: Media[]) : Promise<MessagesResponseDto[]>;

    // Delete Or Remove Message By Its ID and Return Boolean Message If Successfully removed
    deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]) : Promise<boolean>;
    deleteOrRemoveMessageByRoomId( roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]) : Promise<boolean>;

    // Update Message By Its ID and Return the Message to the MessageDto
    updateMessageById(id: number, senderId: number, readAt: Date, receiverId: number, message: Messages, updatedAt: Date) : Promise<MessagesResponseDto | null>;
    updateMessageByRoomId( id: number,roomId: number, senderId: number, readAt: Date, message: Messages, updatedAt: Date) : Promise<MessagesResponseDto | null>;
}