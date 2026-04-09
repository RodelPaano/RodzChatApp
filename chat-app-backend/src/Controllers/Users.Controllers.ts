import UsersServices from "../Services/UsersServices";
import { Request, Response } from "express";

export default class UsersControllers  {
    private userServices : UsersServices;
    
    constructor(userServices: UsersServices) {
        this.userServices = userServices
    }

    public async createUserAccount(req: Request, res: Response): Promise<Response | null> {
        const user = req.body;

        const createUserAccountResponse = await this.userServices.createUserAccount(user);
        if(!createUserAccountResponse) {
            return res.status(400).json({success: false, message: "Failed to create user account"});
        }
        return res.status(201).json({success: true, data: createUserAccountResponse});
    }

    public async loginUserAccount(req: Request, res: Response): Promise<Response | null> {
        try {
            const { email, password } = req.body;
            const loginUserAccountResponse = await this.userServices.loginUserAccount(email, password);
            if(!loginUserAccountResponse) {
                return res.status(400).json({success: false, message: "Failed to login user account"});
            }
            return res.status(200).json({success: true, data: loginUserAccountResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async updateUserDetailsAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const user = req.body;
            const updateUserDetailsAccountByIdResponse = await this.userServices.updateUserDetailsAccountById(id, user);
            if(!updateUserDetailsAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to update user details account by id"});
            }
            return res.status(200).json({success: true, data: updateUserDetailsAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async updateUserRole(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { role } = req.body;
            const updateUserRoleResponse = await this.userServices.updateUserRole(id, role);
            if(!updateUserRoleResponse) {
                return res.status(400).json({success: false, message: "Failed to update user role"});
            }
            return res.status(200).json({success: true, data: updateUserRoleResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async updateUserEmailAndPasswordById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { email, password } = req.body;
            const updateUserEmailAndPasswordByIdResponse = await this.userServices.updateUserEmailAndPasswordById(id, email, password);
            if(!updateUserEmailAndPasswordByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to update user email and password by id"});
            }
            return res.status(200).json({success: true, data: updateUserEmailAndPasswordByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async getUserAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const getUserAccountByIdResponse = await this.userServices.getUserAccountById(id);
            if(!getUserAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to get user account by id"});
            }
            return res.status(200).json({success: true, data: getUserAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async getUserAccountByEmail(req: Request, res: Response): Promise<Response | null> {
        try {
            const email = req.params.email;
            const getUserAccountByEmailResponse = await this.userServices.getUserAccountByEmail(email);
            if(!getUserAccountByEmailResponse) {
                return res.status(400).json({success: false, message: "Failed to get user account by email"});
            }
            return res.status(200).json({success: true, data: getUserAccountByEmailResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async findAllUsers(req: Request, res: Response): Promise<Response | null> {
        try {
            const findAllUsersResponse = await this.userServices.findAllUsers();
            if(!findAllUsersResponse) {
                return res.status(400).json({success: false, message: "Failed to find all users"});
            }
            return res.status(200).json({success: true, data: findAllUsersResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async findAndPaginated(req: Request, res: Response): Promise<Response | null> {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const findAndPaginatedResponse = await this.userServices.findAndPaginated(page, limit);
            if(!findAndPaginatedResponse) {
                return res.status(400).json({success: false, message: "Failed to find and paginated users"});
            }
            return res.status(200).json({success: true, data: findAndPaginatedResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async searchUserAccount(req: Request, res: Response): Promise<Response | null> {
        try {
            const search = req.query.search as string;
            const searchUserAccountResponse = await this.userServices.searchUserAccount(search);
            if(!searchUserAccountResponse) {
                return res.status(400).json({success: false, message: "Failed to search user account"});
            }
            return res.status(200).json({success: true, data: searchUserAccountResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async verifyUserAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const verifyUserAccountByIdResponse = await this.userServices.verifyUserAccountById(id);
            if(!verifyUserAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to verify user account by id"});
            }
            return res.status(200).json({success: true, data: verifyUserAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async blockUserAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const blockUserAccountByIdResponse = await this.userServices.blockUserAccountById(id);
            if(!blockUserAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to block user account by id"});
            }
            return res.status(200).json({success: true, data: blockUserAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async setBlockedUserAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { isBlocked } = req.body;
            const setBlockedUserAccountByIdResponse = await this.userServices.setBlockedUserAccountById(id, isBlocked);
            if(!setBlockedUserAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to set blocked user account by id"});
            }
            return res.status(200).json({success: true, data: setBlockedUserAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async getUserIsOnline(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { isOnline, isBlocked, isDeleted, lastLogin } = req.body;
            const getUserIsOnlineResponse = await this.userServices.getUserIsOnline(id, isOnline, isBlocked, isDeleted, lastLogin);
            if(!getUserIsOnlineResponse) {
                return res.status(400).json({success: false, message: "Failed to get user is online"});
            }
            return res.status(200).json({success: true, data: getUserIsOnlineResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async updateUserIfLogoutOrOffline(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { isOnline } = req.body;
            const updateUserIfLogoutOrOfflineResponse = await this.userServices.updateUserIfLogoutOrOffline(id, isOnline);
            if(!updateUserIfLogoutOrOfflineResponse) {
                return res.status(400).json({success: false, message: "Failed to update user if logout or offline"});
            }
            return res.status(200).json({success: true, data: updateUserIfLogoutOrOfflineResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async updateUserLastActiveStatus(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const { lastLogin } = req.body;
            const updateUserLastActiveStatusResponse = await this.userServices.updateUserLastActiveStatus(id, lastLogin);
            if(!updateUserLastActiveStatusResponse) {
                return res.status(400).json({success: false, message: "Failed to update user last active status"});
            }
            return res.status(200).json({success: true, data: updateUserLastActiveStatusResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    async deleteUserAccountById(req: Request, res: Response): Promise<Response | null> {
        try {
            const id = parseInt(req.params.id);
            const deleteUserAccountByIdResponse = await this.userServices.deleteUserAccountById(id);
            if(!deleteUserAccountByIdResponse) {
                return res.status(400).json({success: false, message: "Failed to delete user account by id"});
            }
            return res.status(200).json({success: true, data: deleteUserAccountByIdResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    // ================================================= Forgot Password and Reset Password User Controllers =================================================
    public async forgotPassword(req: Request, res: Response): Promise<Response | null> {
        try {
            const { id, email, newPassword, token } = req.body;
            const forgotPasswordResponse = await this.userServices.forgotPassword(id, email, newPassword, token);
            if(!forgotPasswordResponse) {
                return res.status(400).json({success: false, message: "Failed to forgot password"});
            }
            return res.status(200).json({success: true, data: forgotPasswordResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<Response | null> {
        try {
            const { id, email, newPassword, token } = req.body;
            const resetPasswordResponse = await this.userServices.resetPassword(id, email, newPassword, token);
            if(!resetPasswordResponse) {
                return res.status(400).json({success: false, message: "Failed to reset password"});
            }
            return res.status(200).json({success: true, data: resetPasswordResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }


    // ================================================= Login With Google Account User Controllers =================================================
    public async loginWithGoogleAccount(req: Request, res: Response): Promise<Response | null> {
        try {
            const { email, firstName, lastName, password, googleId, googleToken } = req.body;
            const loginWithGoogleAccountResponse = await this.userServices.loginWithGoogleAccount(email, firstName, lastName, password, googleId, googleToken);
            if(!loginWithGoogleAccountResponse) {
                return res.status(400).json({success: false, message: "Failed to login with google account"});
            }
            return res.status(200).json({success: true, data: loginWithGoogleAccountResponse});
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }
}