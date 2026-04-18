import UsersResponseDto from "../Dtos/UsersDto";
import { CreateUserInput } from "../Helper/InputField";
import Users, { MessageStatus, UserRole } from "../Models/User";

export interface UsersAutoMapperInterface {
    mapToModel(input: CreateUserInput, hashedPassword: string) : Users;
    mapToDto(user: Users) : UsersResponseDto;
}

export interface UsersRepositoryInterface {
    createUserAccount(user: Users) : Promise<Users | null>;
    loginUserAccount(email: string, password: string) : Promise<Users | null>;

    // Update the User Data
    updateUserDetailsAccountById(id: number, user: Users) : Promise<Users | null>;
    updateUserRole(id: number, role: UserRole) : Promise<Users | null>;
    updateUserEmailAndPasswordById(id: number, email: string, password: string) : Promise<Users | null>;

    // Read the Data
    getUserAccountById(id: number) : Promise<Users | null>;
    getUserAccountByEmail(email: string) : Promise<Users | null>;  
    findAllUsers() : Promise<Users[] | null>;

    // Find and Pagination the User Data
    findAndPaginated(page: number, limit: number) : Promise<Users[] | null>;

    // Search the User Data
    searchUserAccount(search: string) : Promise<Users[] | null>;

    // Verify User Account  Data
    verifyUserAccountById(id: number) : Promise<Users | null>;

    // Update or Get User Online Status
    getUserIsOnline(id: number, isOnline: boolean, isBlocked: boolean, isDeleted: boolean, lastLogin: Date) : Promise<boolean>;
    updateUserIfLogoutOrOffline(id: number, isOnline: boolean) : Promise<boolean>;

    // Update User Last Active Status and Tract the Last Login TimeStamps
    updateUserLastActiveStatus(id: number, lastLogin: Date) : Promise<boolean>;
    

    // Delete User Account Data
    deleteUserAccountById(id: number) : Promise<Users | null>;

    // Forgot and Reset Password User Interfaces
    // forgotPassword(id: number ,email: string, newPassword: string, token: string) : Promise<Users | null>;
    resetPassword(id: number, email: string, newPassword: string, token: string) : Promise<Users | null>;

    // Login With Google Account User Interfaces
    loginWithGoogleAccount(email: string, firstName: string, lastName: string, password: string, googleId: string, googleToken: string) : Promise<Users | null>;

}

export interface UsersServiceInterface {
    // Create and Auth User Services Dto Interfaces
    createUserAccount(user: Users) : Promise<UsersResponseDto | null>;
    loginUserAccount(email: string, password: string) : Promise<UsersResponseDto | null>;

    // Update the User Services Dto Data
    updateUserDetailsById(id: number, user: Users) : Promise<UsersResponseDto | null>;
    updateUserRole(id: number, role: UserRole) : Promise<UsersResponseDto | null>;
    updateUserEmailAndPasswordById(id: number, email: string, password: string) : Promise<UsersResponseDto | null>;

    // Read User Services Dto Data
    getUserAccountById(id: number) : Promise<UsersResponseDto | null>;
    getUserAccountByEmail(email: string) : Promise<UsersResponseDto | null>
    findAllUsers() : Promise<UsersResponseDto[] | null>;

    // Find and Pagination the User Services Dto Data
    findAndPaginated(page: number, limit: number) : Promise<UsersResponseDto[] | null>;

    // Search the User Services Dto Data
    searchUserAccount(search: string) : Promise<UsersResponseDto[] | null>;

    // Verify User Services Dto Data
    verifyUserAccountById(id: number) : Promise<UsersResponseDto | null>;

    // Get User Account Data
    getUserIsOnline(id: number, isOnline: boolean, isBlocked: boolean, isDeleted: boolean, lastLogin: Date) : Promise<boolean>;
    updateUserIfLogoutOrOffline(id: number, isOnline: boolean) : Promise<boolean>;

    // Update User Last Active Status and Tract the Last Login TimeStamps
    updateUserLastActiveStatus(id: number, lastLogin: Date) : Promise<boolean>;


    // Delete User Services Dto Data
    deleteUserAccountById(id: number) : Promise<UsersResponseDto | null>;

    // Forgot and Reset Password User Services Dto Interfaces
    forgotPassword(id: number ,email: string, newPassword: string, token: string) : Promise<UsersResponseDto | null>;
    resetPassword(id: number, email: string, newPassword: string, token: string) : Promise<UsersResponseDto | null>;

    // Login With Google Account User Services Dto Interfaces
    loginWithGoogleAccount(email: string, firstName: string, lastName: string, password: string, googleId: string, googleToken: string) : Promise<UsersResponseDto  | null>;
}