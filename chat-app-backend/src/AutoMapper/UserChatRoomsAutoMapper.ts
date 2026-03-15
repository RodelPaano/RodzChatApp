import UserChatRoomsResponseDto from "../Dtos/UserChatRoomsDto";
import UsersChatRooms, {RoomRole} from "../Models/UsersChatRooms";
import { UserChatRoomsAutoMapperInterface } from "../Interfaces/UserChatRoomInterface";

export default class UserChatRoomsAutoMapper implements UserChatRoomsAutoMapperInterface {
    mapDtoToModel(userChatRooms: UserChatRoomsResponseDto): UsersChatRooms {
        return new UsersChatRooms(
            userChatRooms.id,
            userChatRooms.userId,
            userChatRooms.roomId,
            userChatRooms.role as unknown as RoomRole,
            userChatRooms.isActive,
            userChatRooms.joinedAt,
            userChatRooms.removedAt || null,
            userChatRooms.leftAt || new Date(),
            userChatRooms.updatedAt || new Date()
        );
    }

    mapModelToDto(userChatRooms: UsersChatRooms): UserChatRoomsResponseDto {
        return {
            id: userChatRooms.id,
            userId: userChatRooms.userId,
            roomId: userChatRooms.roomId,
            role: userChatRooms.role as unknown as RoomRole,
            isActive: userChatRooms.isActive,
            joinedAt: userChatRooms.joinedAt,
            removedAt: userChatRooms.removedAt ,
            leftAt: userChatRooms.leftAt,
            updatedAt: userChatRooms.updatedAt
        }
    }
}