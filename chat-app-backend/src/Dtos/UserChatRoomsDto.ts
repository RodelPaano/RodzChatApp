import { RoomRole } from "../Models/UsersChatRooms";

export default interface UserChatRoomsResponseDto {
    id: number,
    userId: number;
    roomId: string
    role: RoomRole,
    isActive: boolean,
    joinedAt: Date,
    leftAt?: Date,
    removedAt?: Date | null,
    updatedAt?: Date,
}

