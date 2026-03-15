import Messages from "../Models/Messages";
import MessagesResponseDto from "../Dtos/MessagesDto";
import ChatRooms from "../Models/Rooms";

export  interface MessagesAutoMapperInterface {
    mapToModel(dto: MessagesResponseDto) : Messages;
    mapToDto(Model: Messages) : MessagesResponseDto;
}

export interface MessagesRepositoryInterface {
    // Send an Message Post to the database and send back the Message Model
    sendMessage( senderId: number, receiverId: number, message: Messages) : Promise<Messages>;
    sendMultipleMessagesToAllFriends( senderId: number, receiverId: number[], message: Messages) : Promise<Messages[]>;
    sendMessageToRoom(roomId: number,  senderId: number, message: Messages)  : Promise<Messages>;

    // Get Message By Its ID and Return the Message Message to the messageDto
    getMessageById(id: number) : Promise<Messages | null>;
    getMessagesByReceiverId( senderId: number, receiverId: number, offset: number) : Promise<Messages[]>;
    getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, offset: number) : Promise<Messages[]>;

    // Delete Or Remove Message By Its ID and return Boolean Message if Successfully removed
    deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date) : Promise<boolean>;
    deleteOrRemoveMessageByRoomId( roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date) : Promise<boolean>;

    // Update Message By Its ID and return the Message Message to the messageDto
    updateMessageById(messageId: number, senderId: number, receiverId: number, message: Messages, updatedAt: Date) : Promise<Messages | null>;
    updateMessageByRoomId(roomId: number, senderId: number, message: Messages, updatedAt: Date) : Promise<Messages | null>; 
}

export interface MessageServicesInterface {
    // Send an Message Post to the Database and send back the Message Dto
    sendMessage( senderId: number, receiverId: number, message: Messages) : Promise<MessagesResponseDto>;
    sendMultipleMessagesToAllFriends( senderId: number, receiverId: number[], message: Messages) : Promise<MessagesResponseDto[]>;
    sendMessageToRoom(roomId: number, senderId: number, message: Messages) : Promise<MessagesResponseDto>;

    // Get Message By Its Id and Return the Message MessageDto
    getMessageById(messageId: number) : Promise<MessagesResponseDto | null>;
    getMessagesByReceiverId(senderId: number, receiverId: number, offset: number) : Promise<MessagesResponseDto[]>;
    getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, offset: number) : Promise<MessagesResponseDto[]>;

    // Delete Or Remove Message By Its ID and Return Boolean Message If Successfully removed
    deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date) : Promise<boolean>;
    deleteOrRemoveMessageByRoomId( roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date) : Promise<boolean>;

    // Update Message By Its ID and Return the Message to the MessageDto
    updateMessageById(messageId: number, senderId: number, receiverId: number, message: Messages, updatedAt: Date) : Promise<MessagesResponseDto | null>;
    updateMessageByRoomId(roomId: number, senderId: number, message: Messages) : Promise<MessagesResponseDto | null>;
}