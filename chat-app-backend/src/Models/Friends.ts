export enum FriendShipStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    Blocked = "Blocked",
}

export class Friends {
    id!: number;
    requesterId: number;
    addresseeId: number;
    status: FriendShipStatus;
    acceptedAt: Date | null ;
    blockedAt: Date | null;
    createdAt: Date    ;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor (
        id: number,
        requesterId: number,
        addresseeId: number,
        status: FriendShipStatus,
        acceptedAt: Date | null = null,
        blockedAt: Date | null = null,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date | null,
    ) {
        this.id = id;
        this.requesterId = requesterId;
        this.addresseeId = addresseeId;
        this.status = status;
        this.acceptedAt = acceptedAt ?? null;
        this.blockedAt = blockedAt ?? null
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt; 
    }
}

export enum ActiveStatus {
    Active = "Active",
    Inactive = "Inactive",
}

export enum StatusMode {
    Manual = "Manual",
    Automatic = "Automatic",

}


export interface OnlineFriends extends Friends {
    firstName: string;
    lastName: string;
    isOnline: boolean;
}