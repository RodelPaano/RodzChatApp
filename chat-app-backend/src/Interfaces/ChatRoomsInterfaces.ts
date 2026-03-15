import ChatRoomsResponseDto from "../Dtos/ChatRoomsDto";
import ChatRooms, { Media } from "../Models/Rooms";
import Users from "../Models/User";
import UsersChatRooms from "../Models/UsersChatRooms";

export interface ChatRoomsAutoMapperInterface {
    mapChatRoomToChatRoomModel(chatRoom: ChatRoomsResponseDto): ChatRooms
    mapModelToDto(chatRoom: ChatRooms): ChatRoomsResponseDto
}

export interface ChatRoomsRepositoryInterface {
    // Create
    create(chatRoom: ChatRooms): Promise<ChatRooms>;

    // Membership
    addUserToChatRoom(chatRoomId: number, userId: number): Promise<boolean>;
    removeUserFromChatRoom(chatRoomId: number, userId: number): Promise<boolean>;

    // Get Membership
    getUsersInChatRoom(chatRoomId: number): Promise<Users[]>;

    // Read
    findAll(): Promise<ChatRooms[]>;
    findById(id: number): Promise<ChatRooms | null>;

    // Media Handler 
    addMediaToChatRoom(id: number, media: Media): Promise<boolean>;
    removeMediaFromChatRoom(roomId: number, mediaId: number): Promise<boolean>;
    getMediaFromChatRoom(roomId: number): Promise<Media[]>;
    downloadMediaFromChatRoom(id: number, mediaId:number): Promise<Media | null>;

    // Update  
    update(id: number, chatRoom: Partial<ChatRooms>): Promise<ChatRooms | null>;

    // Soft Delete 
    delete(id: number): Promise<boolean>;

    // Hard Delete 
    hardDelete(id: number) : Promise<boolean>;   
}

export interface ChatRoomsServicesInterface {
    // Create
    create(chatRoom: ChatRooms): Promise<ChatRoomsResponseDto>;

    // Membership
    addUserToChatRoom(chatRoomId: number, userId: number): Promise<boolean>;
    removeUserFromChatRoom(chatRoomId: number, userId: number): Promise<boolean>;
    getUsersInChatRoom(chatRoomId: number): Promise<Users[]>;

    // Read
    findAll(): Promise<ChatRoomsResponseDto[]>;
    findById(id: number): Promise<ChatRoomsResponseDto | null>;

    // Media Handler 
    addMediaToChatRoom(id: number, media: Media): Promise<boolean>;
    removeMediaFromChatRoom(id: number, media: Media): Promise<boolean>;
    getMediaFromChatRoom(id: number): Promise<Media[]>;
    downloadMediaFromChatRoom(id: number, MediaId:number): Promise<Buffer>;

    // Update
    update(id: number, chatRoom: Partial<ChatRooms>): Promise<ChatRoomsResponseDto | null>;

    // Delete
    delete(id: number): Promise<boolean>;
}