import { Request, Response } from "express";
import FriendServices from "../Services/FriendsServices";

export default class FriendsControllers {
    private friendServices: FriendServices;
    constructor(friendServices: FriendServices) {
        this.friendServices = friendServices;
    }

    // ===================== Add Friend Controller ========================== //
    public async addFriendController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const { requesterId, addresseeId, createdAt } = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false, 
                    message: "RequesterId and AddresseeId are required"
                });
            }

            const result = await this.friendServices.addFriend(
                requesterId, 
                addresseeId, 
                createdAt as Date
            );
            if(!result) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to Add Friend"
                });
            }

            return res.status(200).json({
                success: true, 
                message: "Friend Added Successfully", 
                data: result
            });

        } catch (error: any) {
            console.error("Error in addFriend Controller:", error);
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }


    // ===================== Hard Delete Friend Controller =============================== //
    public async deleteFriendController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const { requesterId, addresseeId } = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false, 
                    message: "RequesterId and AddresseeId are required"
                });
            }

            const result = await this.friendServices.HardDeleteFriendRequest(requesterId, addresseeId);
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Delete friend"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Deleted Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in deleteFriend Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ======================= Soft Delete Friend Controller ===================================== //
    public async softDeleteFriendController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId, deletedAt} = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId and AddresseeId are required"
                });
            }

            const result = await this.friendServices.SoftDeleteFriendRequest(
                requesterId, 
                addresseeId, 
                deletedAt as Date
            );
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Soft Delete Friend"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Soft Deleted Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Soft Delete Friend Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // =============================== Get Friends List By User ID Controllers =============================== //
    public async getFriendsListByUserIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const { requesterId, status } = req.query;
            if(!requesterId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId is Required"
                });
            }

            const result = await this.friendServices.getFriendsListByUserId(parseInt(requesterId as string), status as any);
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Get Friends List"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friends List Retrieved Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Get Friends List By User ID Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================== Get FriendShip Status Controller =============================== //
    public async getFriendShipStatusController(req: Request, res: Response) : Promise< Response | null> {
        try {

            const {requesterId, addresseeId} = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId and AddresseeId are Required"
                });
            }

            const result = await this.friendServices.getFriendshipStatus(parseInt(requesterId), parseInt(addresseeId));
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Get FriendShip Status"
                });
            }

            return res.status(200).json({
                success: true,
                message: "FriendShip Status Retrieved Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Get FriendShip Status Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // =============================== Get FriendShip Status By List Controller =============================== //
    public async getFriendShipStatusByListController(req: Request, res: Response) : Promise<Response | null> {
        try {

            const {requesterId, addresseeIds, statusList} = req.body;
            if(!requesterId || !addresseeIds) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId and AddresseeIds are Required"
                });
            }

            const result = await this.friendServices.getFriendshipStatusByList(parseInt(requesterId), addresseeIds, statusList as any);
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Get FriendShip Status By List"
                });
            }

            return res.status(200).json({
                success: true,
                message: "FriendShip Status By List Retrieved Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Getting FriendShip Status By List Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================== Response Or Accept Friend Request Controller =============================== //
    public async responseOrAcceptFriendRequestController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId, status, friendAt} = req.body;
            if(!requesterId || !addresseeId || !status) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId, AddresseeId and Status are Required"
                });
            }
            const result = await this.friendServices.responseOrAcceptFriendRequest(
                parseInt(requesterId),
                parseInt(addresseeId),
                status,
                friendAt as Date
            );
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Response Or Accept Friend Request"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Response Or Accept Friend Request Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Response Or Accept Friend Request Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================== Get Friend Requests By RequesterId To AddresseeId Controller =============================== //
    public async getFriendRequestsByRequesterIdToAddresseeIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId, status} = req.query;
            if(!requesterId || !addresseeId || !status) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId, AddresseeId and Status are Required"
                });
            }
            const result = await this.friendServices.getFriendRequestsByRequesterIdToAddresseeId(
                parseInt(requesterId as string),
                parseInt(addresseeId as string),
                status as any
            );
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Get Friend Requests By RequesterId To AddresseeId"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Requests By RequesterId To AddresseeId Successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error in Get Friend Requests By RequesterId To AddresseeId Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    
    // ============================== Get Friend Requests By RequesterId And Status Controller =============================== //
    public async getFriendRequestsByRequesterIdAndStatusController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId, status} = req.query;
            if(!requesterId || !addresseeId || !status) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId, AddresseeId and Status are Required"
                });
            }

            const result = await this.friendServices.getFriendRequestsByRequesterIdAndStatus(
                parseInt(requesterId as string),
                parseInt(addresseeId as string),
                status as any
            );
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Get Friend Requests By RequesterId And Status"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Requests By RequesterId And Status Retrieved Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Get Friend Requests By RequesterId And Status Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================== Update Friend Request Status Controller =============================== //
    public async updateFriendRequestStatusController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId, status, updatedAt} = req.body;
            if(!requesterId || !addresseeId || !status) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId, AddresseeId and Status are Required"
                });
            }

            const result = await this.friendServices.updateFriendRequestStatus(
                parseInt(requesterId),
                parseInt(addresseeId),
                status,
                updatedAt as Date
            );
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Update Friend Request Status"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Request Status Updated Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Update Friend Request Status Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================== Search Friends By requesterId And Search Term Controller =============================== //
    public async searchFriendsByRequesterIdAndSearchTermController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, searchTerm} = req.query;
            if(!requesterId || !searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: "requesterId and SearchTerm are Required"
                });
            }
            const result = await this.friendServices.searchFriendsByUserIdAndSearchTerm(parseInt(requesterId as string), searchTerm as string);
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Search Friends By requesterId And Search Term"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friends By requesterId And Search Term Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Search Friends By requesterId And Search Term Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ================================================ Block Friend By ID Controller ========================================================= //
    public async blockFriendByIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId} = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId and AddresseeId are Required"
                });
            }
            const result = await this.friendServices.blockFriendById(parseInt(requesterId), parseInt(addresseeId));
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Block Friend"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Blocked Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Block Friend By ID Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    
    // ================================================ Unblock Friend By ID Controller ========================================================= //
    public async unblockFriendByIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId, addresseeId} = req.body;
            if(!requesterId || !addresseeId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId and AddresseeId are Required"
                });
            }
            const result = await this.friendServices.unblockFriendById(parseInt(requesterId), parseInt(addresseeId));
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Unblock Friend"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friend Unblocked Successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error in Unblock Friend By ID Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================= Count Friends By User ID Controller =============================== //
    public async countFriendsByUserIdController(req: Request, res: Response) : Promise<Response | null> {
        try {

            const {requesterId} = req.query;
            if(!requesterId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId is Required"
                });
            }

            const result = await this.friendServices.countFriendsByUserId(parseInt(requesterId as string));
            if(result === null) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Count Friends By User ID"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Friends Count By User ID Retrieved Successfully",
                data: result
            }); 

        } catch (error: any) {
            console.error("Error in Count Friends By User ID Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================= Count Pending Friend Requests By User ID Controller =============================== //
    public async countPendingFriendRequestsByUserIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const {requesterId} = req.query;
            if(!requesterId) {
                return res.status(400).json({
                    success: false,
                    message: "RequesterId is Required"
                });
            }
            const result = await this.friendServices.countPendingFriendRequestsByUserId(parseInt(requesterId as string));
            if(!result) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to Count Pending Friend Requests By User ID"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Pending Friend Requests Count By User ID Retrieved Successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Error in Count Pending Friend Requests By User ID Controller:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ====================================== Get Mutual Friends Between Users Controllers ========================================== //
    public async getMutualFriendsBetweenUsersController(req: Request, res: Response) : Promise<Response | null> {
        try {

        } catch (error: any) {
            console.error("Error Getting Mutual Friends Between Users:", error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    } 

}