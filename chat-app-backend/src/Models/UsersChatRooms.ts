export enum RoomRole {
  Member = "member",
  Moderator = "moderator",
  Owner = "owner",
}

export default class UsersChatRooms {
  id!: number;
  userId!: number;                          // Foreign Key to Users
  roomId!: string;                          // Foreign Key to ChatRooms (UUID or string)
  role!: RoomRole ;  // expanded roles
  isActive!: boolean;                       // track current membership
  joinedAt!: Date;                          // when user joined
  removedAt!: Date | null;                    // when user was removed (if applicable)
  leftAt!: Date;                           // when user left
  updatedAt!: Date;   
  static mapModelToDto: any;                     // when role/status changed

  constructor (
    id: number,
    userId: number,
    roomId: string,
    role: RoomRole,
    isActive: boolean,
    joinedAt: Date,
    removedAt: Date | null,
    leftAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.roomId = roomId;
    this.role = role;
    this.isActive = isActive;
    this.joinedAt = joinedAt;
    this.removedAt = removedAt;
    this.leftAt = leftAt;
    this.updatedAt = updatedAt;
  }
}