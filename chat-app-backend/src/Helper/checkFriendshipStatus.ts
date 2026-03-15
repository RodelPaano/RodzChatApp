import { FriendShipStatus } from "../Models/Friends";

// Helper Function to Check if User Can Add Friend Based on Current Friendship Status
export const canAddFriend = (status: FriendShipStatus): boolean => {
    switch (status) {
        case FriendShipStatus.Blocked:
        case FriendShipStatus.Pending:
        case FriendShipStatus.Accepted:
            return false; // cannot add again
        case FriendShipStatus.Rejected:
        case FriendShipStatus.Unblocked:
            return true; // can try to add again
        default:
            return true; // treat unknown as allowed
    }
};

// Helper Function to Get User-Friendly Message Based on Friendship Status
export const getFriendshipMessage = (status: FriendShipStatus): string => {
    switch (status) {
        case FriendShipStatus.Blocked:
            return "You cannot add this friend because they are blocked.";
        case FriendShipStatus.Pending:
            return "Friend request is still pending.";
        case FriendShipStatus.Accepted:
            return "You are already friends.";
        case FriendShipStatus.Rejected:
            return "You can send a new friend request.";
        case FriendShipStatus.Unblocked:
            return "You can add this friend again.";
        default:
            return "Status unknown, please try again.";
    }
};