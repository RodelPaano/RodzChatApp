import FriendsResponseDto from "../Dtos/FriendsDto";
import { Friends, FriendShipStatus } from "../Models/Friends";

export interface FriendsAutoMapperInterface {
    mapToModel (model: FriendsResponseDto) : Friends;
    mapToDto (model: Friends) : FriendsResponseDto;

    // Map List of Friends Model to Dto
    mapToModelList (models: FriendsResponseDto[]) : Friends [];
    mapToDtoList (dtos: Friends[]) : FriendsResponseDto [];
}

export interface FriendsRepositoryInterface {
    // Add Friend
    addFriend(requesterId: number, addresseeId: number, createdAt: Date ) : Promise<Friends | null>;

    // Hard Remove Friend Request By Requester ID and Addressee ID
    HardDeleteFriendRequest(requesterId: number, addresseeId: number) : Promise<Friends | null>;

    // Soft Delete Friend Request By Requester ID and Addressee ID
    softDeleteFriendRequest(requesterId: number, addresseeId: number, deletedAt: Date) : Promise<Friends | null>;

    // Accept and Reject Friend Request
    respondOrAcceptFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus, friendAt: Date) : Promise<Friends | null>;

    // Get Friends List By User id
    getFriendsListByRequesterId(requesterId: number, status: FriendShipStatus, friendAt: Date) : Promise<Friends[] | null>;
    getFriendshipStatus(requesterId: number, addresseeId: number) : Promise<Friends | null>;
    getFriendshipStatusByList(requesterId: number, addresseeId: number, statusList: FriendShipStatus[], friendAt: Date) : Promise<Friends[] | null>;
    
    // Get Friend Requests By User Id
    getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus, createdAt: Date) : Promise<Friends[] | null>;
    getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus) : Promise<Friends[] | null>;

    // Update Friend Request and Status
    updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus, updatedAt: Date) : Promise<Friends | null>;

    // Search Friends By User Id and Search Term
    searchFriendsByRequesterIdAndSearchTerm(requesterId: number, searchTerm: string) : Promise<Friends[] | null>;

    // Block and Unblocked Friend By id
    blockFriendById(requesterId: number, addresseeId: number) : Promise<Friends | null>;
    unblockFriendById(requesterId: number, addresseeId: number) : Promise<Friends | null>;

    // Counts and Metrics of Friends
    countFriendsByUserId(requesterId: number) : Promise<number>;
    countPendingFriendRequestsByUserId(requesterId: number) : Promise<number>;

    // Get Mutual Friends Between Two Users
    getMutualFriendsBetweenUsers(requesterId: number, otherUserId: number) : Promise<Friends[] | null>;

    // Get Suggestion Friends By User id
    getSuggestedFriendsByRequesterId(requesterId: number, otherUserId: number) : Promise<Friends[] | null>;

    // Get History of Friend and Audit loginUserAccount
    getFriendshipHistoryByRequesterId(requesterId: number, addresseeId: number) : Promise<Friends[] | null>;
}

export interface FriendsServicesInterface {

    // Add Friend interface Services 
    addFriend(requesterId: number, addresseeId: number, createdAt: Date) : Promise<FriendsResponseDto | null>;

    // Hard Delete Interface Services
    HardDeleteFriendRequest(requesterId: number, addresseeId: number) : Promise<FriendsResponseDto | null>;

    // Soft Delete Interfaces Services
    SoftDeleteFriendRequest(requesterId: number, addresseeId: number, deletedAt: Date) : Promise<FriendsResponseDto | null>;

    // Accept Friend Request Interface Services
    responseOrAcceptFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus, friendAt: Date) : Promise<FriendsResponseDto | null>;
    
    // Get Friends List By User Id
    getFriendsListByUserId(requesterId: number, status: FriendShipStatus) : Promise<FriendsResponseDto[] | null>;
    getFriendshipStatus(requesterId: number, addresseeId: number) : Promise<FriendsResponseDto | null>;
    getFriendshipStatusByList(requesterId: number, addresseeId: number, statusList: FriendShipStatus[]) : Promise<FriendsResponseDto[] | null>;

    // Get Friend Requests By User Id
    getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus) : Promise<FriendsResponseDto[] | null>;
    getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus) : Promise<FriendsResponseDto[] | null>;

    // Update Friend Request and Status
    updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus, updatedAt: Date) : Promise<FriendsResponseDto | null>;

    // Search Friends By User Id and Search Term
    searchFriendsByUserIdAndSearchTerm(requesterId: number, searchTerm: string) : Promise<FriendsResponseDto[] | null>;

    // Block and Unblocked Friend By id
    blockFriendById(requesterId: number, addresseeId: number) : Promise<FriendsResponseDto | null>;
    unblockFriendById(requesterId: number, addresseeId: number) : Promise<FriendsResponseDto | null>;

    // Counts and Metrics of Friends
    countFriendsByUserId(requesterId: number) : Promise<number>;
    countPendingFriendRequestsByUserId(requesterId: number) : Promise<number>;

    // Get Mutual Friends Between Two Users
    getMutualFriendsBetweenUsers(requesterId: number, otherUserId: number) : Promise<FriendsResponseDto[] | null>;

    // Get Suggestion Friends By User id
    getSuggestedFriendsByUserId(requesterId: number, otherUserId: number) : Promise<FriendsResponseDto[] | null>;

    // Get History of Friend and Audit loginUserAccount
    getFriendshipHistoryByUserId(requesterId: number, addresseeId: number) : Promise<FriendsResponseDto[] | null>;
}  