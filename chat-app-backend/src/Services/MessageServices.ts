import { MessageServicesInterface } from "../Interfaces/MessagesInterfaces";
import { MessagesAutoMapperInterface } from "../Interfaces/MessagesInterfaces";
import { MessageStatus } from "../Models/User";
import MessagesResponseDto from "../Dtos/MessagesDto";
import MessagesRepository from "../Repositories/MessageRepository";
import { redisClient as redisClient } from "../Config/redis_connection";
import Messages from "../Models/Messages";
import { Media } from "../Models/Rooms";

export default class MessageServices implements MessageServicesInterface {
    private messagesRepository: MessagesRepository;
    private messagesAutoMapper: MessagesAutoMapperInterface;
    private redisClient = redisClient;
    constructor(messagesRepository: MessagesRepository, messagesAutoMapper: MessagesAutoMapperInterface) {
        this.messagesRepository = messagesRepository;
        this.messagesAutoMapper = messagesAutoMapper;
    }


    // ============================================= Send Message to the Receiver and Process in Repository and Save ========================================================================= //
    public async sendMessage(senderId: number, receiverId: number, message: Messages, mediaFile: Media[]): Promise<MessagesResponseDto> {
        try {
            if(!Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
                throw new Error("Sender ID and Receiver ID must be valid numbers.");
            }

            if(!message || !message.message) {
                throw new Error("Message is required.");
            }

            const sendMessage = await this.messagesRepository.sendMessage(senderId, receiverId, message, mediaFile );
            if(!sendMessage) {
                throw new Error("Failed to Send Message to Your Friend");
            }
            if(!sendMessage.senderId || !sendMessage.receiverId) {
                throw new Error("Failed to Send Message to Your Friend");
            }

            const messageDto = this.messagesAutoMapper.mapToDto(sendMessage);

            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`)
            await this.redisClient.expire(`messages:${receiverId}`, 3600);

            return messageDto;

        } catch (error) {
            console.error("Error Sending Message:", error);
            throw error;
        }
    }


    public async sendMultipleMessagesToAllFriends(senderId: number, receiverId: number[], message: Messages, mediaFile: Media[]): Promise<MessagesResponseDto[]> {
        try {
            if(!Number.isInteger(senderId) || !Array.isArray(receiverId)) {
                throw new Error("Sender ID and Receiver IDs must be valid.");
            }

            if(!message || !message.message) {
                throw new Error("Message is required.");
            }
            const sendMultipleMessagesToAllFriends = await this.messagesRepository.sendMultipleMessagesToAllFriends(senderId, receiverId, message, mediaFile);
            if(!sendMultipleMessagesToAllFriends || sendMultipleMessagesToAllFriends.length === 0) {
                throw new Error("Failed to Send Message to Your Friends");
            }

            const messageDtos = sendMultipleMessagesToAllFriends.map(msg => this.messagesAutoMapper.mapToDto(msg));

            await this.redisClient.del(`messages:${senderId}`);
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            receiverId.forEach(async (id) => {
                await this.redisClient.del(`messages:${id}`);
                await this.redisClient.expire(`messages:${id}`, 3600);
            });

            return messageDtos;
        } catch (error) {
            console.error("Error Sending Multiple Messages:", error);
            throw error;
        }
    }


    public async sendMessageToRoom(roomId: number, senderId: number, message: Messages, mediaFile: Media[]): Promise<MessagesResponseDto> {
        try {
            if(!Number.isInteger(roomId) || !Number.isInteger(senderId)) {
                throw new Error("Room ID and Sender ID must be valid numbers.");
            }

            if(!message || !message.message) {
                throw new Error("Message is required.");
            }

            const sendMessageToRoom = await this.messagesRepository.sendMessageToRoom(roomId, senderId, message, mediaFile);
            if(!sendMessageToRoom) {
                throw new Error("Failed to Send Message to Room");
            }

            const messageDto = this.messagesAutoMapper.mapToDto(sendMessageToRoom);
            await this.redisClient.del(`messages:${roomId}`)
            await this.redisClient.expire(`messages:${roomId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            return messageDto;

        } catch (error) {
            console.error("Error Sending Message to Room:", error);
            throw error;
        }
    }

    // =============================================== Reply to Message have Sender ID From Receiver Id ========================================================================== //
    public async replyToMessageFromReceiverToSender(senderId: number, receiverId: number, message: Messages, replyAt: Date, mediaFile: Media[]): Promise<MessagesResponseDto[]> {
        try {
            if(!Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
                throw new Error("Sender ID and Receiver ID must be valid numbers.");
            }

            if(!message || !message.message) {
                throw new Error("Message is required.");
            }

            if(!replyAt || !replyAt.getTime()) {
                throw new Error("Reply At is required.");
            }
            const replyToMessageFromReceiverToSender = await this.messagesRepository.replyToMessageFromReceiverToSender(senderId, receiverId, message, replyAt, mediaFile);
            if(!replyToMessageFromReceiverToSender || replyToMessageFromReceiverToSender.length === 0) {
                throw new Error("Failed to Reply to Message");
            }

            const messageDtos = replyToMessageFromReceiverToSender.map(msg => this.messagesAutoMapper.mapToDto(msg));

            await this.redisClient.del(`messages:${senderId}`);
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`);
            await this.redisClient.expire(`messages:${receiverId}`, 3600);
            await this.redisClient.del(`messages:${replyAt}`);
            await this.redisClient.expire(`messages:${replyAt}`, 3600);
            return messageDtos;

        } catch (error) {
            console.error("Error Sending Message to Room:", error);
            throw error;
        }
    }

    // ================================================== Reply to Message From Room By Sender to Receiver ========================================================================== //
    public async replyToMessageFromRoomBySenderToReceivers(roomId: number, senderId: number, message: Messages, replyAt: Date, mediaFile: Media[]): Promise<MessagesResponseDto[]> {
        try {
            if(!Number.isInteger(roomId) || !Number.isInteger(senderId)) {
                throw new Error("Room ID and Sender ID must be valid numbers.");
            }

            if(!message || !message.message) {
                throw new Error("Message is required.");
            }

            if(!replyAt || !replyAt.getTime()) {
                throw new Error("Reply At is required.");
            }
            const replyToMessageFromRoomBySenderToReceivers = await this.messagesRepository.replyToMessageFromRoomBySenderToReceivers(roomId, senderId, message, replyAt, mediaFile);
            if(!replyToMessageFromRoomBySenderToReceivers || replyToMessageFromRoomBySenderToReceivers.length === 0) {
                throw new Error("Failed to Reply to Message");
            }

            const messageDtos = replyToMessageFromRoomBySenderToReceivers.map(msg => this.messagesAutoMapper.mapToDto(msg));
            await this.redisClient.del(`messages:${roomId}`);
            await this.redisClient.expire(`messages:${roomId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`);
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${replyAt}`);
            await this.redisClient.expire(`messages:${replyAt}`, 3600);

            return messageDtos;

        } catch (error) {
            console.error("Error Sending Message to Room:", error);
            throw error;
        }
    }


    // ========================================================================== Get Message By Its ID and  Return this Message to the MessageDto ========================================================================== //
    public async getMessageBySenderIdToReceiverId(id: number,senderId: number, receiverId: number, readAt: Date): Promise<MessagesResponseDto | null> {
        try {
            if(!Number.isInteger(id)) {
                throw new Error(`Message ID must be a valid number. Message ID: ${id}`);
            }

            if(!Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
                throw new Error(`Sender ID and Receiver ID must be Valid Numbers. Sender ID: ${senderId} And receiverId: ${receiverId}`)
            }

            const getMessageById = await this.messagesRepository.getMessageBySenderIdToReceiverId(id, senderId, receiverId, readAt);
            if(!getMessageById ) {
                return null;
            }

            const messageDto = this.messagesAutoMapper.mapToDto(getMessageById);
            await this.redisClient.del(`messages:${id}`)
            await this.redisClient.expire(`messages:${id}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`)
            await this.redisClient.expire(`messages:${receiverId}`, 4500)
            await this.redisClient.del(`messages:${readAt}`)
            await this.redisClient.expire(`messages:${readAt}`, 3600);

            return messageDto;

        } catch (error) {
            console.error("Error Getting Message By ID:", error);
            throw error;
        }
    }


    public async getMessagesByReceiverId(senderId: number, receiverId: number, readAt: Date, offset: number): Promise<MessagesResponseDto[]> {
        try {
            if(!Number.isInteger(senderId) || !Number.isInteger(receiverId) || !Number.isInteger(offset)) {
                throw new Error("Sender ID, Receiver ID, and Offset must be valid numbers.");
            }

            if(!readAt || !readAt.getTime()) {
                throw new Error("ReadAt must be a valid date.");
            }

            const getMessagesByReceiverId = await this.messagesRepository.getMessagesByReceiverId(senderId, receiverId, readAt, offset);
            if(!getMessagesByReceiverId || getMessagesByReceiverId.length === 0) {
                return [];
            }

            const messageDtos = getMessagesByReceiverId.map(msg => this.messagesAutoMapper.mapToDto(msg[0]));
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`)
            await this.redisClient.expire(`messages:${receiverId}`, 3600);
            await this.redisClient.del(`messages:${readAt}`)
            await this.redisClient.expire(`messages:${readAt}`, 3600);
            await this.redisClient.del(`messages:${offset}`)
            await this.redisClient.expire(`messages:${offset}`, 3600);
            return messageDtos;

        } catch (error) {
            console.error("Error Getting Messages By Receiver ID:", error);
            throw error;
        }
    }


    public async getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number,receiverIds: number[], readAt: Date, offset: number): Promise<MessagesResponseDto[]> {
        try {
            if(!Number.isInteger(roomId) || !Number.isInteger(senderId) || !Number.isInteger(offset)) {
                throw new Error("Room ID, Sender ID, and Offset must be valid numbers.");
            }

            if(!readAt || !readAt.getTime()) {
                throw new Error("ReadAt must be a valid date.");
            }

            const getMessagesByRoomIdOrGroupChat = await this.messagesRepository.getMessagesByRoomIdOrGroupChat(roomId, senderId, receiverIds, readAt, offset);
            if(!getMessagesByRoomIdOrGroupChat || getMessagesByRoomIdOrGroupChat.length === 0) {
                return [];
            }

            const messageDtos = getMessagesByRoomIdOrGroupChat.map(msg => this.messagesAutoMapper.mapToDto(msg[0]));
            await this.redisClient.del(`messages:${roomId}`)
            await this.redisClient.expire(`messages:${roomId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverIds}`)
            await this.redisClient.expire(`messages:${receiverIds}`, 3600);
            await this.redisClient.del(`messages:${readAt}`)
            await this.redisClient.expire(`messages:${readAt}`, 3600);
            await this.redisClient.del(`messages:${offset}`)
            await this.redisClient.expire(`messages:${offset}`, 3600);
            return messageDtos;

        } catch (error) {
            console.error("Error Getting Messages By Room ID:", error);
            throw error;
        }
    }


    // ================================================================== Delete Message By Its ID ========================================================================== //
    public async deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]): Promise<boolean> {
        try {
            if(!Number.isInteger(messageId) || !Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
                throw new Error("Message ID, Sender ID, and Receiver ID must be valid numbers.");
            }
            if(!isHardDelete && !deletedAt) {
                throw new Error("If isHardDelete is false, deletedAt must be provided.");
            }

            const deleteOrRemoveMessageToUserOrFriendByMessageId = await this.messagesRepository.deleteOrRemoveMessageToUserOrFriendByMessageId(messageId, senderId, receiverId, message, isHardDelete, deletedAt, mediaFile);
            if(!deleteOrRemoveMessageToUserOrFriendByMessageId) {
                return false;
            }

            await this.redisClient.del(`messages:${messageId}`)
            await this.redisClient.expire(`messages:${messageId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`)
            await this.redisClient.expire(`messages:${receiverId}`, 3600);
            await this.redisClient.del(`messages:${isHardDelete}`)
            await this.redisClient.expire(`messages:${isHardDelete}`, 3600);
            await this.redisClient.del(`messages:${mediaFile}`)
            await this.redisClient.expire(`messages:${mediaFile}`, 3600);

            return true;
        } catch (error) {
            console.error("Error Deleting or Removing Message:", error);
            throw error;
        }
    }

    public async deleteOrRemoveMessageByRoomId(roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]): Promise<boolean> {
        try {
            if(!Number.isInteger(roomId) || !Number.isInteger(senderId)) {
                throw new Error("Room ID and Sender ID must be valid numbers.");
            }
            if(!isHardDelete && !deletedAt) {
                throw new Error("If isHardDelete is false, deletedAt must be provided.");
            }

            const deleteOrRemoveMessageByRoomId = await this.messagesRepository.deleteOrRemoveMessageByRoomId(roomId, messageId, senderId, message, isHardDelete, deletedAt, mediaFile);
            if(!deleteOrRemoveMessageByRoomId) {
                return false;
            }

            await this.redisClient.del(`messages:${roomId}`)
            await this.redisClient.expire(`messages:${roomId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${messageId}`)
            await this.redisClient.expire(`messages:${messageId}`, 3600);
            await this.redisClient.del(`messages:${isHardDelete}`)
            await this.redisClient.expire(`messages:${isHardDelete}`, 3600);
            await this.redisClient.del(`messages:${deletedAt}`)
            await this.redisClient.expire(`messages:${deletedAt}`, 3600);
            await this.redisClient.del(`messages:${mediaFile}`)
            await this.redisClient.expire(`messages:${mediaFile}`, 3600);

            return true;

        } catch (error) {
            console.error("Error Deleting or Removing Message in the Room:", error);
            throw error;
        }
    }


    // =========================================================================== Update Message By Its ID ========================================================================== //
    public async updateMessageById(id: number, senderId: number, readAt: Date, receiverId: number, message: Messages, updatedAt: Date): Promise<MessagesResponseDto | null> {
        try {
            if(!Number.isInteger(id) || !Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
                throw new Error("Message ID, Sender ID, and Receiver ID must be valid numbers.");
            }

            if(!updatedAt || !updatedAt.getTime()) {
                throw new Error("UpdatedAt must be a valid date.");
            }

            if(!readAt || !readAt.getTime()) {
                throw new Error("ReadAt must be a valid date.");
            }

            const updateMessageById = await this.messagesRepository.updateMessageById(id, senderId, receiverId, readAt, message, updatedAt);
            if(!updateMessageById ) {
                return null;
            }

            const messageDto = this.messagesAutoMapper.mapToDto(updateMessageById);
            await this.redisClient.del(`messages:${id}`)
            await this.redisClient.expire(`messages:${id}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${receiverId}`)
            await this.redisClient.expire(`messages:${receiverId}`, 3600);
            await this.redisClient.del(`messages:${updatedAt}`)
            await this.redisClient.expire(`messages:${updatedAt}`, 3600);
            return messageDto;

        } catch (error) {
            console.error("Error Updating Message By its ID:", error);
            throw error;
        }
    }


    public async updateMessageByRoomId(id: number,roomId: number, senderId: number, readAt: Date, message: Messages): Promise<MessagesResponseDto | null> {
        try {
            if(!Number.isInteger(roomId) || !Number.isInteger(senderId)) {
                throw new Error("Room ID and Sender ID must be valid numbers.");
            }
            if(!message || !message.message) {
                throw new Error("Message is required.");
            }
            if(!message.updatedAt || !message.updatedAt.getTime()) {
                throw new Error("UpdatedAt must be a valid date.");
            }

            const updateMessageByRoomId = await this.messagesRepository.updateMessageByRoomId(id, roomId, senderId, readAt, message, message.updatedAt);
            if(!updateMessageByRoomId) {
                return null;
            }

            const messageDto = this.messagesAutoMapper.mapToDto(updateMessageByRoomId);
            await this.redisClient.del(`messages:${roomId}`)
            await this.redisClient.expire(`messages:${roomId}`, 3600);
            await this.redisClient.del(`messages:${senderId}`)
            await this.redisClient.expire(`messages:${senderId}`, 3600);
            await this.redisClient.del(`messages:${message.updatedAt}`)
            await this.redisClient.expire(`messages:${message.updatedAt}`, 3600);
            return messageDto;

        } catch (error) {
            console.error("Error Updating Message By Room ID:", error);
            throw error;
        }
    }

    // ================================================================ More Business Logic For Messages UpComing Features ============================================================================================= //

}