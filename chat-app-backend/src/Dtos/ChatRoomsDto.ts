import { Media } from "../Models/Rooms";
import UserChatRoomsResponseDto from "./UserChatRoomsDto";

export default interface ChatRoomsResponseDto {
    id: string;

    // Rooms Information
    name: string;
    description?: string;
    icon?: string;
    ownerId: number;
    ownersName: string;
    members: UserChatRoomsResponseDto[];

    // Media Information
    media: Media[];

    // Rooms System TimeStamp
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}