import ChatRoomsResponseDto from "../Dtos/ChatRoomsDto";
import ChatRooms, { Media } from "../Models/Rooms";
import Users from "../Models/User";
import UsersChatRooms from "../Models/UsersChatRooms";

export interface ChatRoomsCreation {
    name: string;
    description: string;
    icon?: string;
    ownerId?: number;
}

export interface ChatRoomsAutoMapperInterface {
    mapChatRoomToChatRoomModel(chatRoom: ChatRoomsResponseDto): ChatRooms
    mapModelToDto(chatRoom: ChatRooms): ChatRoomsResponseDto
}

export interface ChatRoomsRepositoryInterface {
    // ==================== Create Chat Room ================================ //
    createChatRoom(name: string, description: string, icon: string, ownerId: number, createdAt: Date): Promise<ChatRooms>;

    // ==================== Update Name and Icon of Chat Room  where Id Belong to the ownerId ================================ //
    updateNameAndIconByIdWhereBelongToOwnerId(id: number, name: string, icon: string, ownerId: number, updatedAt: Date) : Promise<ChatRooms | null>;
    updateDescriptionByIdWhereBelongToOwnerId(id: number, description: string, ownerId: number, updatedAt: Date) : Promise<ChatRooms | null>;

    // ==================== Delete Chat Room But Only can Delete this Chat Room where Id Belong to the ownerId ================================ //
    deleteChatRoomByIdWhereBelongToOwnerId(id: number, ownerId: number, deletedAt: Date) : Promise<ChatRooms | null>;

    // ==================== Get Chat Rooms By ID ====================================== //
    findChatRoomById(id: number): Promise<ChatRooms | null>;

    // ============================ Retrieved All Chat Rooms ================================= //
    findAllChatRooms(): Promise<ChatRooms[]>;

    // ============================ Get Chat Rooms By Owner ID ================================= //
    findChatRoomsByOwnerId(ownerId: number): Promise<ChatRooms[]>;
    
}

export interface ChatRoomsServicesInterface {
    // ==================== Create Chat Room ================================ //
    createChatRoom(chatRoom: ChatRoomsCreation) : Promise<ChatRoomsResponseDto | null>;

    // ===================== Update Name and Icon of Chat Room where Id Belong to the ownerId ================================ //
    updateNameAndIconByIdWhereBelongToOwnerId(id: number, name: string, icon: string, ownerId: number, updatedAt: Date) : Promise<ChatRoomsResponseDto | null>;
    updateDescriptionByIdWhereBelongToOwnerId(id: number, description: string, ownerId: number, updatedAt: Date) : Promise<ChatRoomsResponseDto | null>;

    // ===================== Delete Chat Room But Only can Delete this Chat Room where Id Belong to the ownerId ================================ //
    deleteChatRoomByIdWhereBelongToOwnerId(id: number, ownerId: number, deletedAt: Date) : Promise<ChatRoomsResponseDto | null>;

    // ==================== Get Chat Rooms By ID ====================================== //
    findChatRoomById(id: number): Promise<ChatRoomsResponseDto | null>;

    // ============================ Retrieved All Chat Rooms ================================= //
    findAllChatRooms(): Promise<ChatRoomsResponseDto[]>;

    // ============================ Get Chat Rooms By Owner ID ================================= //
    findChatRoomsByOwnerId(ownerId: number): Promise<ChatRoomsResponseDto[]>
    
}