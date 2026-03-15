import Messages from "../Models/Messages";
import MessagesResponseDto from "../Dtos/MessagesDto";
import {MessagesAutoMapperInterface} from "../Interfaces/MessagesInterfaces";
import { Media } from "../Models/Rooms";

export default class MessageAutoMapper implements MessagesAutoMapperInterface {

    mapToModel(dto: MessagesResponseDto): Messages {
        return new Messages(
            dto.id,
            dto.senderId,
            dto.receiverId || 0,
            dto.roomId,
            dto.message,
            dto.media as unknown as Media[],
            dto.createdAt,
            dto.updatedAt,
            dto.deletedAt,
            dto.receivedAt,
            dto.readAt,
            dto.replyAt,
            dto.replyToMessageId
        );
    }

    mapToDto(Model: Messages): MessagesResponseDto {
        return {

            // Foreign Key UsersAutoMapper
            id: Model.id,
            senderId: Model.senderId,
            receiverId: Model.receiverId || 0,
            roomId: Model.roomId,

            // Non Foreign Key
            roomName: "",
            senderName: "",
            receiverName: "",
            message: Model.message,
            media: Model.media,
            createdAt: Model.createdAt,
            updatedAt: Model.updatedAt || new Date(),
            deletedAt: Model.deletedAt || new Date(),
            receivedAt: Model.receivedAt || new Date(),
            readAt: Model.readAt || new Date(),
            replyAt: Model.replyAt || new Date(),
            replyToMessageId: Model.replyToMessageId || ""
        };
    }
}
