import ChatRoomHelper from "../Helper/ChatRoom.Helper";
import { ChatRoomsCreation, ChatRoomsServicesInterface } from "../Interfaces/ChatRoomsInterfaces";
import  ChatRoomsResponseDto  from "../Dtos/ChatRoomsDto";
import ChatRoomsRepository from "../Repositories/RoomsRepository";
import ChatRoomMapper from "../AutoMapper/ChatRoomAutoMapper";
import { redisClient } from "../Config/redis_connection";

export class ChatRoomsServices implements ChatRoomsServicesInterface {
    private readonly chatRoomRepository: ChatRoomsRepository;
    private readonly chatRoomMapper: ChatRoomMapper;
    private readonly redisClient = redisClient;
    private readonly chatRoomCacheKey = "chatRoom";

    constructor() {
        this.chatRoomRepository = new ChatRoomsRepository();
        this.chatRoomMapper = new ChatRoomMapper();
    }
    
    // ================================ Create ChatRoom Services ==================================================
    public async createChatRoom(chatRoom: ChatRoomsCreation): Promise<ChatRoomsResponseDto | null> {
        try {
            const validationError = ChatRoomHelper.validateCreateChatRoom(chatRoom);
            if (validationError) {
                throw new Error(validationError);
            }

            const { name, description, icon, ownerId } = chatRoom;
            const createdAt = new Date();

            const newChatRoom = await this.chatRoomRepository.createChatRoom(name, description, icon ?? '', ownerId ?? 0, createdAt);
            if (!newChatRoom) {
                return null;
            }

            const chatRoomDto = this.chatRoomMapper.mapModelToDto(newChatRoom);

            // Cache the new chat room
            await this.redisClient.set(`${this.chatRoomCacheKey}:${chatRoomDto.id}`, JSON.stringify(chatRoomDto), {
                EX: 3600 // 1 hour expiration
            });
            
            return chatRoomDto;
        } catch (error) {
            console.error("Error creating chat room:", error);
            throw error;
        }
    }
    
    // =============================================== Update ChatRoom Services ================================================    
    public async updateNameAndIconByIdWhereBelongToOwnerId(id: number, name: string, icon: string, ownerId: number, updatedAt: Date): Promise<ChatRoomsResponseDto | null> {
        try {
            if (!name) {
                throw new Error("Name is required");
            }
            const updatedChatRoom = await this.chatRoomRepository.updateNameAndIconByIdWhereBelongToOwnerId(id, name, icon, ownerId, updatedAt);
            if (!updatedChatRoom) {
                return null;
            }
            const chatRoomDto = this.chatRoomMapper.mapModelToDto(updatedChatRoom);

            // Update the cache
            await this.redisClient.set(`${this.chatRoomCacheKey}:${id}`, JSON.stringify(chatRoomDto), {
                EX: 3600 // 1 hour expiration
            });

            return chatRoomDto;
        } catch (error) {
            console.error("Error updating chat room name and icon:", error);
            throw error;
        }
    }

    // ========================= Update Description of Chat Room where Id Belong to the ownerId ================================ //
    public async updateDescriptionByIdWhereBelongToOwnerId(id: number, description: string, ownerId: number, updatedAt: Date): Promise<ChatRoomsResponseDto | null> {
        try {
            if (!description) {
                throw new Error("Description is required");
            }
            const updatedChatRoom = await this.chatRoomRepository.updateDescriptionByIdWhereBelongToOwnerId(id, description, ownerId, updatedAt);
            if (!updatedChatRoom) {
                return null;
            }
            const chatRoomDto = this.chatRoomMapper.mapModelToDto(updatedChatRoom);

            // Update the cache
            await this.redisClient.set(`${this.chatRoomCacheKey}:${id}`, JSON.stringify(chatRoomDto), {
                EX: 3600 // 1 hour expiration
            });

            return chatRoomDto;
        } catch (error) {
            console.error("Error updating chat room description:", error);
            throw error;
        }
    }

    // ========================= Delete Chat Room But Only can Delete this Chat Room where Id Belong to the ownerId ================================ //
    public async deleteChatRoomByIdWhereBelongToOwnerId(id: number, ownerId: number, deletedAt: Date): Promise<ChatRoomsResponseDto | null> {
        try {
            const deletedChatRoom = await this.chatRoomRepository.deleteChatRoomByIdWhereBelongToOwnerId(id, ownerId, deletedAt);
            if (!deletedChatRoom) {
                return null;
            }

            // Delete from cache
            await this.redisClient.del(`${this.chatRoomCacheKey}:${id}`);

            return this.chatRoomMapper.mapModelToDto(deletedChatRoom);
        } catch (error) {
            console.error("Error deleting chat room:", error);
            throw error;
        }
    }

    // =============================================== Find ChatRoom Services ================================================
    public async findChatRoomById(id: number): Promise<ChatRoomsResponseDto | null> {
        try {
            const cachedChatRoom = await this.redisClient.get(`${this.chatRoomCacheKey}:${id}`);
            if (cachedChatRoom) {
                return JSON.parse(cachedChatRoom);
            }

            const chatRoom = await this.chatRoomRepository.findChatRoomById(id);
            if (!chatRoom) {
                return null;
            }

            const chatRoomDto = this.chatRoomMapper.mapModelToDto(chatRoom);
            
            await this.redisClient.set(`${this.chatRoomCacheKey}:${id}`, JSON.stringify(chatRoomDto), {
                EX: 3600 // 1 hour expiration
            });

            return chatRoomDto;
        } catch (error) {
            console.error("Error finding chat room by id:", error);
            throw error;
        }
    }

    // =============================================== Find All ChatRoom Services ================================================
    public async findAllChatRooms(): Promise<ChatRoomsResponseDto[]> {
        try {
            const cachedChatRooms = await this.redisClient.get(`${this.chatRoomCacheKey}:all`);
            if (cachedChatRooms) {
                return JSON.parse(cachedChatRooms);
            }

            const chatRooms = await this.chatRoomRepository.findAllChatRooms();
            const chatRoomDtos = chatRooms.map(chatRoom => this.chatRoomMapper.mapModelToDto(chatRoom));

            await this.redisClient.set(`${this.chatRoomCacheKey}:all`, JSON.stringify(chatRoomDtos), {
                EX: 3600 // 1 hour expiration
            });

            return chatRoomDtos;
        } catch (error) {
            console.error("Error finding all chat rooms:", error);
            throw error;
        }
    }

    // =============================================== Find ChatRoom By OwnerId Services ================================================
    public async findChatRoomsByOwnerId(ownerId: number): Promise<ChatRoomsResponseDto[]> {
        try {
            const cachedChatRooms = await this.redisClient.get(`${this.chatRoomCacheKey}:owner:${ownerId}`);
            if (cachedChatRooms) {
                return JSON.parse(cachedChatRooms);
            }

            const chatRooms = await this.chatRoomRepository.findChatRoomsByOwnerId(ownerId);
            const chatRoomDtos = chatRooms.map(chatRoom => this.chatRoomMapper.mapModelToDto(chatRoom));

            await this.redisClient.set(`${this.chatRoomCacheKey}:owner:${ownerId}`, JSON.stringify(chatRoomDtos), {
                EX: 3600 // 1 hour expiration
            });

            return chatRoomDtos;
        } catch (error) {
            console.error("Error finding chat rooms by owner id:", error);
            throw error;
        }
    }
}