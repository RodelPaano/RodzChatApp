import { FriendsServicesInterface } from "../Interfaces/FriendsInterfaces";
import { FriendShipStatus } from "../Models/Friends";
import FriendsAutoMapper from "../AutoMapper/FriendsAutoMapper";
import FriendsResponseDto from "../Dtos/FriendsDto";
import { redisClient as redisClient } from "../Config/redis_connection";
import FriendsRepository from "../Repositories/FriendsRepository";
import { canAddFriend, getFriendshipMessage } from "../Helper/checkFriendshipStatus";

export default class FriendsServices implements FriendsServicesInterface {
    private friendsRepository: FriendsRepository;
    private redisClient = redisClient;
    private friendsAutoMapper : FriendsAutoMapper;
    constructor(friendsRepository: FriendsRepository, friendsAutoMapper: FriendsAutoMapper) {
        this.friendsRepository = friendsRepository;
        this.friendsAutoMapper = friendsAutoMapper;
    }


    // ============================ And and Remove Friend ============================
    public async addFriend(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto | null> {
        try {
            (FriendShipStatus.Pending);
            if(!canAddFriend(status)){
                throw new Error(`Invalid Friendship Status: ${getFriendshipMessage(status)}`);
            }
            const friend = await this.friendsRepository.addFriend(requesterId, addresseeId);
            if(!friend || friend.status !== FriendShipStatus.Pending){
                throw new Error(`Failed to send friend request. Current status: ${getFriendshipMessage(friend?.status ?? FriendShipStatus.Blocked)}`);
            }
            
            const friendDto = this.friendsAutoMapper.mapToDto(friend);

            await this.redisClient.del(`friends:${addresseeId}`)
            await this.redisClient.expire(`friends:${addresseeId}`, 3600);

            return friendDto;
        } catch (error) {
            console.error("Error Adding Friend:", error);
            throw error;
        }
    }

    public async removeFriend(userId: number, friendId: number): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)){
                throw new Error("User ID and Friend ID must be valid numbers.");
            }
            const removeFriend = await this.friendsRepository.removeFriendRequest(userId, friendId);
            if(!removeFriend ){
                throw new Error("Failed to remove friend. No Existing Friend Relationship Found.");
            }
            if(removeFriend.status === FriendShipStatus.Accepted){
                throw new Error("Cannot remove friend. You are currently friends. Please unfriend instead.");
            }
            const removeFriendDto = this.friendsAutoMapper.mapToDto(removeFriend);

            await this.redisClient.del(`friends:${friendId}`)
            await this.redisClient.expire(`friends:${friendId}`, 3600);

            return removeFriendDto;
        } catch (error) {
            console.error("Error Removing Friend:", error);
            throw error;
        } 
    }


    // ============================ Get or Read Friend Request By List By User ID ======================================================= //
    public async getFriendsListByUserId(requesterId: number, status: FriendShipStatus): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(requesterId)) {
                throw new Error("User ID must be a valid number.");
            }

            if(!Object.values(FriendShipStatus).includes(status)) {
                throw new Error(`Invalid Friendship Status: ${status}`);
            }

            const friendRequest = await this.friendsRepository.getFriendsListByRequesterId(requesterId, status);
            if(!friendRequest || friendRequest.length === 0) {
                throw new Error("No Friend Requests Found.");
            }

            const friendRequestDtos = this.friendsAutoMapper.mapToDtoList(friendRequest);

            await this.redisClient.del(`friendRequests:${requesterId}`);
            await this.redisClient.expire(`friendRequests:${requesterId}`, 3600);

            return friendRequestDtos;
        } catch (error) {
            console.error("Error Getting Friend Requests:", error);
            throw error;
        }
    }

    public async getFriendshipStatus(userId: number, friendId: number): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)){
                throw new Error("User ID and Friend ID must be valid numbers.");
            }

            const friendshipStatus = await this.friendsRepository.getFriendshipStatus(userId, friendId);
            if(!friendshipStatus){
                throw new Error("No Friendship Status Found.");
            }
            
            const friendshipStatusDto = this.friendsAutoMapper.mapToDto(friendshipStatus);

            await this.redisClient.del(`friendshipStatus:${userId}:${friendId}`);
            await this.redisClient.expire(`friendshipStatus:${userId}:${friendId}`, 3600);
            
            return friendshipStatusDto;

        } catch (error) {
            console.error("Error Getting Friendship Status:", error);
            throw error;
        }
    }

    public async getFriendshipStatusByList(userId: number, friendId: number, statusList: FriendShipStatus[]): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)){
                throw new Error("User ID and Friend ID must be valid numbers.");
            }
            if(!Array.isArray(statusList) || statusList.length === 0){
                throw new Error("Status List must be a non-empty array of valid friendship statuses.");
            }
            
            const validStatuses = Object.values(FriendShipStatus);
            for(const status of statusList){
                if(!validStatuses.includes(status)){
                    throw new Error(`Invalid Friendship Status in List: ${status}`);
                }
            }
            const friendshipStatusList = await this.friendsRepository.getFriendshipStatusByList(userId, friendId, statusList);
            if(!friendshipStatusList || friendshipStatusList.length === 0){
                throw new Error("No Friendship Status Found for the provided status list.");
            }
            const friendshipStatusListDto = this.friendsAutoMapper.mapToDtoList(friendshipStatusList);
            await this.redisClient.del(`friendshipStatusList:${userId}:${friendId}`);
            await this.redisClient.expire(`friendshipStatusList:${userId}:${friendId}`, 3600);
            return friendshipStatusListDto;
        } catch (error) {
            console.error("Error Getting Friendship Status By List:", error);
            throw error;
        }
    }


    // ============================================================= Accept and Reject Friend Request ============================================================= //
    public async responseToFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }
            if(!Object.values(FriendShipStatus).includes(status)){
                throw new Error(`Invalid Friendship Status: ${status}`);  
            }
            const response = await this.friendsRepository.respondToFriendRequest(requesterId, addresseeId, status);
            if(!response){
                throw new Error("Failed to respond to friend request. No Existing Friend Request Found.");
            }
            const responseDto = this.friendsAutoMapper.mapToDto(response);

            await this.redisClient.del(`friendRequests:${addresseeId}`);
            await this.redisClient.expire(`friendRequests:${addresseeId}`, 3600);

            return responseDto;
        } catch (error) {
            console.error("Error Responding to Friend Request:", error);
            throw error;
        }
    }

    public async refuseFriendRequest(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }
            if(!Object.values(FriendShipStatus).includes(status)){
                throw new Error(`Invalid Friendship Status: ${status}`);  
            }
            const response = await this.friendsRepository.refuseFriendRequest(requesterId, addresseeId, status);
            if(!response){
                throw new Error(`Failed to respond to friend request with status: ${status}. No existing request found.`);
            }
            const responseDto = this.friendsAutoMapper.mapToDto(response);
            await this.redisClient.del(`friendRequests:${addresseeId}`);
            await this.redisClient.expire(`friendRequests:${addresseeId}`, 3600);
            return responseDto;
        } catch (error) {
            console.error("Error Refusing Friend Request:", error);
            throw error;
        }
    }


    // ============================= Get Friends Request By User ID and Status ============================= //
    public async getFriendRequestsByRequesterIdToAddresseeId(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }

            if(!Object.values(FriendShipStatus).includes(status)){
                throw new Error(`Invalid Friendship Status: ${status}`);
            }

            const friendRequests = await this.friendsRepository.getFriendRequestsByRequesterIdToAddresseeId(requesterId, addresseeId, status || FriendShipStatus.Pending);
            if(!friendRequests || friendRequests.length === 0){
                throw new Error("No Friend Requests Found.");
            }
            const friendRequestsDto = this.friendsAutoMapper.mapToDtoList(friendRequests);
            await this.redisClient.del(`friendRequests:${requesterId}:${addresseeId}`);
            await this.redisClient.expire(`friendRequests:${requesterId}:${addresseeId}`, 3600);
            return friendRequestsDto;
        } catch (error) {
            console.error("Error Getting Friend Requests By User ID:", error);
            throw error;
        }
    }


    public async getFriendRequestsByRequesterIdAndStatus(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }
            if(!Object.values(FriendShipStatus).includes(status)){
                throw new Error(`Invalid Friendship Status: ${status}`);
            }
            const friendRequests = await this.friendsRepository.getFriendRequestsByRequesterIdAndStatus(requesterId, addresseeId, status);
            if(!friendRequests || friendRequests.length === 0){
                throw new Error("No Friend Requests Found.");
            }
            const friendRequestsDto = this.friendsAutoMapper.mapToDtoList(friendRequests);
            await this.redisClient.del(`friendRequests:${requesterId}:${addresseeId}:${status}`);
            await this.redisClient.expire(`friendRequests:${requesterId}:${addresseeId}:${status}`, 3600);
            return friendRequestsDto;
        } catch (error) {
            console.error("Error Getting Friend Requests By User ID and Status:", error);
            throw error;
        }
    }


    // ============================ Update Friend Request Status ============================= //
    public async updateFriendRequestStatus(requesterId: number, addresseeId: number, status: FriendShipStatus): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }
            if(!Object.values(FriendShipStatus).includes(status)){
                throw new Error(`Invalid Friendship Status: ${status}`);
            }

            const updateRequest = await this.friendsRepository.updateFriendRequestStatus(requesterId, addresseeId, status);
            if(!updateRequest || updateRequest.status === status) {
                throw new Error(`Failed to update friend request status to ${status}. No existing request found or status is already ${status}.`)
            }

            const updateRequestStatusDto = this.friendsAutoMapper.mapToDto(updateRequest);
            await this.redisClient.del(`friendRequests:${addresseeId}`);
            await this.redisClient.expire(`friendRequests:${addresseeId}`, 3600);

            return updateRequestStatusDto;

        } catch (error) {
            console.error("Error Updating Friend Request Status:", error);
            throw error;
        }
    }


    // ============================ Delete Friend Request By requesterId ============================= //
    public async deleteFriendRequestById(requesterId: number, addresseeId: number): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(addresseeId)){
                throw new Error("Requester ID and Addressee ID must be valid numbers.");
            }
            const deleteRequest = await this.friendsRepository.deleteFriendRequestById(requesterId);
            if(!deleteRequest){
                throw new Error("Failed to delete friend request. No existing request found.");
            }
            const deleteRequestDto = this.friendsAutoMapper.mapToDto(deleteRequest);
            await this.redisClient.del(`friendRequests:${addresseeId}`);
            await this.redisClient.expire(`friendRequests:${addresseeId}`, 3600);
            return deleteRequestDto;
        } catch (error) {
            console.error("Error Deleting Friend Request:", error);
            throw error;
        }
    }


    // ============================ Search Friends By User ID and Search Term ============================= //
    public async searchFriendsByUserIdAndSearchTerm(userId: number, searchTerm: string): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(userId)) {
                throw new Error(`User ID must be a valid number. User ID: ${userId}`);
            }

            const searchFriend = await this.friendsRepository.searchFriendsByRequesterIdAndSearchTerm(userId, searchTerm);
            if(!searchFriend || searchFriend.length === 0) {
                throw new Error("Failed to search friends. No existing friends found.");
            }

            const searchFriendDto = this.friendsAutoMapper.mapToDtoList(searchFriend);
            await this.redisClient.del(`searchFriends:${userId}:${searchTerm}`);
            await this.redisClient.expire(`searchFriends:${userId}:${searchTerm}`, 3600);
            return searchFriendDto;
        } catch (error) {
            console.error("Error Searching Friends:", error);
            throw error;
        }
    }


    // ================================================================= Block and Unblocked Friend By friendId ================================================================= //
    public async blockFriendById(userId: number, friendId: number): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)){
                throw new Error("User ID and Friend ID must be valid numbers.");
            }
            const blockFriend = await this.friendsRepository.blockFriendById(userId, friendId);
            if(!blockFriend) {
                throw new Error("Failed to block friend. No existing friend found.");
            }
            const blockFriendDto = this.friendsAutoMapper.mapToDto(blockFriend);
            await this.redisClient.del(`blockFriend:${userId}:${friendId}`);
            await this.redisClient.expire(`blockFriend:${userId}:${friendId}`, 3600);
            return blockFriendDto;
        } catch (error) {
            console.error("Error Blocking Friend:", error);
            throw error;
        }
    }

    public async unblockFriendById(userId: number, friendId: number): Promise<FriendsResponseDto | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)) {
                throw new Error("User ID and Friend ID must be valid numbers.");
            }

            const unblockFriend = await this.friendsRepository.unblockFriendById(userId, friendId);
            if(!unblockFriend) {
                throw new Error("Failed to unblock friend. No existing friend found.");
            }
            const unblockFriendDto = this.friendsAutoMapper.mapToDto(unblockFriend);
            await this.redisClient.del(`unblockFriend:${userId}:${friendId}`);
            await this.redisClient.expire(`unblockFriend:${userId}:${friendId}`, 3600);
            return unblockFriendDto;
        } catch (error) {
            console.error("Error Unblocking Friend:", error);
            throw error;
        }
    }


    // ============================================================= Count and Metrics of Friends ================================================================//
    public async countFriendsByUserId(userId: number): Promise<number> {
        try {
            if(!Number.isInteger(userId)) {
                throw new Error(`User ID must be a valid number. User ID: ${userId}`);
            }

            const countFriend = await this.friendsRepository.countFriendsByUserId(userId);
            if(!countFriend) {
                throw new Error("Failed to count friends. No existing friends found.");
            }

            return countFriend;
        } catch (error) {
            console.error("Error Counting Friends:", error);
            throw error;
        }
    }

    public async countPendingFriendRequestsByUserId(userId: number): Promise<number> {
        try {
            if(!Number.isInteger(userId)) {
                throw new Error(`User ID must be a valid number. User ID: ${userId}`);
            }

            const countPendingFriendRequest = await this.friendsRepository.countPendingFriendRequestsByUserId(userId);
            if(!countPendingFriendRequest) {
                throw new Error("Failed to count pending friend requests. No existing pending friend requests found.");
            }

            return countPendingFriendRequest;
        } catch (error) {
            console.error("Error Counting Pending Friend Requests:", error);
            throw error;
        }
    }



    // ============================================================== Get Mutual Friends Between Two Users ============================================================== //
    public async getMutualFriendsBetweenUsers(userId: number, otherUserId: number): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(otherUserId)) {
                throw new Error("User ID and Other User ID must be valid numbers.");
            }

            const mutualFriend = await this.friendsRepository.getMutualFriendsBetweenUsers(userId, otherUserId);
            if(!mutualFriend || mutualFriend.length === 0) {
                throw new Error("Failed to get mutual friends. No existing mutual friends found.");
            }

            const mutualFriendDto = this.friendsAutoMapper.mapToDtoList(mutualFriend);
            await this.redisClient.del(`mutualFriends:${userId}:${otherUserId}`);
            await this.redisClient.expire(`mutualFriends:${userId}:${otherUserId}`, 3600);
            return mutualFriendDto;
        } catch (error) {
            console.error("Error Getting Mutual Friends:", error);
            throw error;
        }
    }


    // ====================================================================== Get Suggestion Friends By User id ====================================================================== //
    public async getSuggestedFriendsByUserId(requesterId: number, otherUserId: number): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(requesterId) || !Number.isInteger(otherUserId)) {
                throw new Error("Requester ID and Other User ID must be valid numbers.");
            }

            const suggestedFriend = await this.friendsRepository.getSuggestedFriendsByRequesterId(requesterId, otherUserId);
            if(!suggestedFriend || suggestedFriend.length === 0) {
                throw new Error("Failed to get suggested friends. No existing suggested friends found.");
            }

            const suggestedFriendDto = this.friendsAutoMapper.mapToDtoList(suggestedFriend);
            await this.redisClient.del(`suggestedFriends:${requesterId}`);
            await this.redisClient.expire(`suggestedFriends:${otherUserId}`, 3600);
            return suggestedFriendDto;
        } catch (error) {
            console.error("Error Getting Suggested Friends:", error);
            throw error;
        }
    }


    // ======================================================================== Get Friend History By User Id ======================================================================= //
    public async getFriendshipHistoryByUserId(userId: number, friendId: number): Promise<FriendsResponseDto[] | null> {
        try {
            if(!Number.isInteger(userId) || !Number.isInteger(friendId)) {
                throw new Error("User ID and Friend ID must be valid numbers.");
            }

            const friendHistory = await this.friendsRepository.getFriendshipHistoryByRequesterId(userId, friendId);
            if(!friendHistory || friendHistory.length === 0) {
                return [];
            }

            const friendHistoryDto = this.friendsAutoMapper.mapToDtoList(friendHistory);
            await this.redisClient.del(`friendHistory:${userId}:${friendId}`);
            await this.redisClient.expire(`friendHistory:${userId}:${friendId}`, 3600);
            return friendHistoryDto;
        } catch (error) {
            console.error("Error Getting Friend History:", error);
            throw error;
        }
    }







}