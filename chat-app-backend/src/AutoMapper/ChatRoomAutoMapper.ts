import ChatRooms, { Media } from "../Models/Rooms";
import ChatRoomsResponseDto from "../Dtos/ChatRoomsDto";
import { ChatRoomsAutoMapperInterface } from "../Interfaces/ChatRoomsInterfaces";
import UsersChatRooms, { RoomRole } from "../Models/UsersChatRooms";
import UserRoomRole  from "../Dtos/UserChatRoomsDto";


export default class ChatRoomMapper implements ChatRoomsAutoMapperInterface {

mapChatRoomToChatRoomModel(chatRoom: ChatRoomsResponseDto): ChatRooms {
 return new ChatRooms(
   chatRoom.id,
   chatRoom.name,
   chatRoom.description || "",
   chatRoom.icon,
   chatRoom.ownerId,
   chatRoom.members.map(member => new UsersChatRooms(
     member.id,
     member.userId,
     member.roomId,
     member.role as unknown as RoomRole, 
     member.isActive,
     member.joinedAt,
     member.removedAt ?? null,
     member.leftAt ?? new Date(),
     member.updatedAt ?? new Date(),
   )),
   chatRoom.media as Media[],
   chatRoom.createdAt,
   chatRoom.updatedAt,
   chatRoom.deletedAt
 );
}

mapModelToDto(chatRoom: ChatRooms): ChatRoomsResponseDto {
 return {
   id: chatRoom.id,
   name: chatRoom.name,
   description: chatRoom.description,
   icon: chatRoom.icon,
   ownerId: chatRoom.ownerId,
   ownersName: chatRoom.members.find(m => m.role === RoomRole.Owner)?.userId.toString() || "",
   members: chatRoom.members.map(member => UsersChatRooms.mapModelToDto(member) as UserRoomRole).map(member => ({
     id: member.id,
     userId: member.userId,
     roomId: member.roomId,
     role: member.role as unknown as RoomRole, 
     isActive: member.isActive,
     joinedAt: member.joinedAt,
     removedAt: member.removedAt,
     leftAt: member.leftAt,
     updatedAt: member.updatedAt,
   })),
   media: chatRoom.media as Media[],
   createdAt: chatRoom.createdAt,
   updatedAt: chatRoom.updatedAt,
   deletedAt: chatRoom.deletedAt
 };
}
}