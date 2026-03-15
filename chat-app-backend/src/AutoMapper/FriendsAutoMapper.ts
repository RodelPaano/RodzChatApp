import FriendsResponseDto from "../Dtos/FriendsDto";
import { Friends, FriendShipStatus } from "../Models/Friends";
import { FriendsAutoMapperInterface } from "../Interfaces/FriendsInterfaces";

export default class FriendsAutoMapper implements FriendsAutoMapperInterface {
    mapToModel(model: FriendsResponseDto): Friends {
        return new Friends(
            model.id ? parseInt(model.id) : 0,
            model.requesterId,
            model.addresseeId,
            model.status,
            model.createdAt,
            model.updatedAt,
            model.deletedAt ? new Date(model.deletedAt) : null
        );
    }

    mapToDto(model: Friends): FriendsResponseDto {
        return {
            id: model.id.toString(),
            requesterId: model.requesterId,
            addresseeId: model.addresseeId,
            requesterName: "",
            addresseeName: "",
            requesterAvatar: "",
            addresseeAvatar: "",
            status: model.status,            
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            deletedAt: model.deletedAt ? new Date(model.deletedAt) : null
        };
    }

    mapToDtoList(dtos: Friends[]): FriendsResponseDto[] {
        return (
            dtos.map((dto) => this.mapToDto(dto))
        );
    }

    mapToModelList(models: FriendsResponseDto[]): Friends[] {
        return (
            models.map((model) => this.mapToModel(model))
        );
    }
}