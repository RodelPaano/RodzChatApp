import { FriendShipStatus } from "../Models/Friends";

export default interface FriendsResponseDto {
    id: string;
    requesterId: number;    // foreign key to user who send an Friends request
    addresseeId: number;    // foreign key to user who receive an Friends request


    // friendship Information
    requesterName: string;
    addresseeName: string;

    requesterAvatar?: string;
    addresseeAvatar?: string;

    // friendship status
    status: FriendShipStatus;

    // System TimeStamps
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;

}