export enum FriendShipStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    Blocked = "Blocked",
    Unblocked = "Unblocked",
}

export class Friends {
    id!: number;
    requesterId!: number;
    addresseeId!: number;
    status!: FriendShipStatus;
    acceptedAt!: Date | null;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date | null;

    constructor (
        id: number,
        requesterId: number,
        addresseeId: number,
        status: FriendShipStatus,
        acceptedAt: Date | null,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date | null,
    ) {
        this.id = id;
        this.requesterId = requesterId;
        this.addresseeId = addresseeId;
        this.status = status;
        this.acceptedAt = acceptedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt; 
    }
}