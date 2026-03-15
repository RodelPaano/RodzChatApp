import UserChatRoomsResponseDto from "../Dtos/UserChatRoomsDto";
import UsersChatRooms, { RoomRole } from "../Models/UsersChatRooms";

export interface UserChatRoomsAutoMapperInterface {
    mapModelToDto(userChatRooms: UsersChatRooms) : UserChatRoomsResponseDto;
    mapDtoToModel(userChatRooms: UserChatRoomsResponseDto) : UsersChatRooms;
}

export interface UserChatRoomsRepositoryInterface {
    // Create a UserChatRooms and Entry in the Database
    create(userChatRooms: UsersChatRooms): Promise<UsersChatRooms>;

    // Find All UserChatRooms for a User
    findUserChatRooms(userId: number) : Promise<UsersChatRooms[]>;
    
    // Find All UserChatRooms for a Room
    findChatRooms(roomId: string) : Promise<UsersChatRooms[]>;

    // Find All UserChatRooms for a User and Room
    findUserChatRoomsByRoomId(userId: number, roomId: string) : Promise<UsersChatRooms[]>;

    // Remove and Delete User From a Room
    removeUserFromRoom(userId: number, roomId: string, role: RoomRole): Promise<UsersChatRooms | null>;

    // Update UserChatRooms
    updateUserChatRooms(userChatRooms: UsersChatRooms): Promise<UsersChatRooms>;
}

export interface UserChatRoomsServiceInterface {
    // Create a UserChatRooms and Entry and Process in the ChatRoomsRepositoryInterface
    create(userChatRooms: UsersChatRooms) : Promise<UserChatRoomsResponseDto>;

    // Find All UserChatRooms for a User
    findUserChatRooms(userId: number) : Promise<UserChatRoomsResponseDto[]>;
    findChatRooms(roomId: number) : Promise<UserChatRoomsResponseDto[]>;
    
    // Find All UserChatRooms for a User and Rooms
    findUserChatRoomsByRoomIdAndUserId(userId: number, roomId: number) : Promise<UserChatRoomsResponseDto[]>;

    // Remove and Delete User From a Room
    removeUserFromRoom(userId: number, roomId: number, role: RoomRole): Promise<UserChatRoomsResponseDto | null>;

    // Update UserChatRooms and Process in the ChatRoomsRepositoryInterface
    updateUserChatRooms(userChatRooms: UsersChatRooms) : Promise<UserChatRoomsResponseDto>;
}