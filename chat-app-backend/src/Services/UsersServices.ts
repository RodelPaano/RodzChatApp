import UsersRepository from "../Repositories/UsersRepository";
import {UsersServiceInterface, UsersRepositoryInterface} from "../Interfaces/UsersInterface";
import UsersResponseDto from "../Dtos/UsersDto";
import UsersAutoMapper from "../AutoMapper/UsersAutoMapper";
import Users from "../Models/User";
import { UserRole } from "../Models/User";
import { hashPassword, comparePassword } from "../Helper/HashPassword";
import { setUserRole } from '../Helper/SetUserRole'; 
import { loginInput, updateUserEmailAndPasswordInput, updateUserInput, UpdateUserRole, validateCreateUserInput} from "../Helper/InputField";
import { regexEmail, validateEmail, validatePasswordInput, validateVerifyAccountInput } from "../Helper/RegexEmail";
import {redisClient as redisClient} from "../Config/redis_connection";
import { removeSpecialCharacters, validateSearchInput, validateSearchType } from "../Helper/SearchHelper";
import * as AuthGoogle from "../Utils/AuthGoogle";



export default class UsersServices implements UsersServiceInterface {
    private usersRepository: UsersRepository;
    private redisClient = redisClient;
    private mapper: UsersAutoMapper ;
    private authGoogle = AuthGoogle;
    constructor (usersRepository: UsersRepository, mapper: UsersAutoMapper) {
        this.usersRepository = usersRepository;
        this.mapper = mapper;
    }


    // ================================================= Create User Account and Login User Account Services and Process and Check the Business Logic =========================================================================  //

    public async createUserAccount(user: Users): Promise<UsersResponseDto | null> {
        try {

            const input = validateCreateUserInput({
                userName: user.userName,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email as string,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar,
                password: user.password,
                address: user.address,
                city: user.city,
                state: user.state,
                zipCode: user.zipCode,
                country: user.country,
                preferences: user.preferences,
                role: user.role,
            });

            const { email, password, role } = input;

            const validateEmailInput = validateEmail(email);
            if(!validateEmailInput) {
                throw new Error("Valid Email is Required");
            }
            
            // Check if the User is Already Exists in the Database By email
            const ExistingUser = await this.usersRepository.getUserAccountByEmail(email);
            if(ExistingUser && !ExistingUser.isDeleted) {
                throw new Error("Email is Already Exists in the Database");
            }

            // Hash the Password before Storing it in the Database
            const hashedPassword = await hashPassword(password);

            // Set Role
            user.role = setUserRole(role as UserRole);

            // Map Input to User Model
            const userModel = this.mapper.mapToModel(input, hashedPassword);
            userModel.role = user.role as UserRole;

            // Create the User Account in the Database
            const createdUser = await this.usersRepository.createUserAccount(userModel);
            if(!createdUser) {
                throw new Error("Failed to Create User Account");
            }
            const dto = this.mapper.mapToDto(createdUser);

            // Redis Cache the User Account
            await this.redisClient.set(`user:${dto.id}`, JSON.stringify(createdUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dto;
        }
        catch (error) {
            console.error("Error creating user account:", error);
            throw error;
        }
    }


    public async loginUserAccount(email: string, password: string): Promise<UsersResponseDto | null> {
        try {

            const { email: loginEmail, password: loginPassword } = loginInput(email, password);
            if(!loginEmail || !loginPassword) {
                throw new Error("Email and Password is Required");
            }

            const user = await this.usersRepository.getUserAccountByEmail(loginEmail);

            if(!user) {
                throw new Error("User Not Found");
            }
            if(user.isBlocked || user.isDeleted) {
                throw new Error("User Account is Blocked or Deleted");
            }

            const isPasswordMatch = await comparePassword(loginPassword, user.password);

            if(!isPasswordMatch) {
                throw new Error("Invalid Password");
            }

            const dtoLoginUser = this.mapper.mapToDto(user);

            await this.redisClient.set(`user:${dtoLoginUser.id}` , JSON.stringify(user), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoLoginUser;

        } catch(error) {
            console.error("Error Login User Account:", error);
            throw error;
        }
    }



    // ======================================================= Update User Account and Save on the User Repository and Process and Check the Business Logic =========================================================================  //

    public async updateUserDetailsAccountById(id: number, user: Users): Promise<UsersResponseDto | null> {
        try {
            const updateUserInputField = updateUserInput(user);
            if(!updateUserInputField || Object.keys(updateUserInputField).length === 0) {
                throw new Error("At Least One Field is Required to Update User Account.");
            }

            const updateUser = await this.usersRepository.updateUserDetailsAccountById(id, updateUserInputField);
            if(!updateUser) {
                throw new Error("Failed to Update User Account");   
            }

            if(updateUser.isBlocked || updateUser.isDeleted) {
                throw new Error("User Account is Blocked or Deleted");
            }
            
            const dtoUpdateUser = this.mapper.mapToDto(updateUser);

            await this.redisClient.set(`user:${dtoUpdateUser.id}`, JSON.stringify(updateUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUpdateUser;

        } catch (error) {
            console.error("Error Update User Account:", error);
            throw error;
        }
        
    }


    public async updateUserRole(id: number, role: UserRole): Promise<UsersResponseDto | null> {
        try {

            const input = UpdateUserRole(id, role);
            if(!input.id || !input.role) {
                throw new Error("Id and Role is Required");
            }

            const updateUser = await this.usersRepository.updateUserRole(input.id, input.role as UserRole);
            if(!updateUser) {
                throw new Error("Failed to Update User Role");
            }
            if(updateUser.isBlocked || updateUser.isDeleted){
                throw new Error("User Account is Blocked or Deleted");
            }

            const dtoUpdateRoleUser = this.mapper.mapToDto(updateUser);

            await this.redisClient.set(`user:${dtoUpdateRoleUser.id}`, JSON.stringify(updateUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUpdateRoleUser;
        } catch (error) {
            console.error("Error Update User Role:", error);
            throw error;
        }
    }


    public async updateUserEmailAndPasswordById(id: number, email: string, password: string): Promise<UsersResponseDto | null> {
        try {

            const input = updateUserEmailAndPasswordInput(id, email, password);
            if(!input.id || !input.email || !input.password) {
                throw new Error("Id, Email and Password is Required");
            }

            if(!regexEmail.test(input.email)) {
                throw new Error("Valid Email is Required");
            }

            const hashedPassword = await hashPassword(password);

            const updateUser = await this.usersRepository.updateUserEmailAndPasswordById(input.id, input.email, hashedPassword);
            if(!updateUser) {
                throw new Error("Failed to Update User Email and Password");
            }
            if(updateUser.isBlocked || updateUser.isDeleted) {
                throw new Error("User Account is Blocked or Deleted");
            }

            const dtoUpdateUser = this.mapper.mapToDto(updateUser);

            await this.redisClient.set(`user:${dtoUpdateUser.id}`, JSON.stringify(updateUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUpdateUser;

        } catch (error) {
            console.error("Error Update User Email and Password:", error);
            throw error;
        }
    }



    // ====================================================================== Get User Account Services and Process and Check the Business Logic =========================================================================  //
    public async getUserAccountById(id: number): Promise<UsersResponseDto | null> {
        try {

            const user = await this.usersRepository.getUserAccountById(id);
            if(!user) {
                throw new Error("User Not Found");
            }
            if(user.isBlocked || user.isDeleted) { 
                throw new Error("User Account is Blocked or Deleted");
            }

            const dtoUser = this.mapper.mapToDto(user);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(user), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;
        } catch (error) {
            console.error("Error Get User Account:", error);
            throw error;
        }
    }

    public async getUserAccountByEmail(email: string): Promise<UsersResponseDto | null> {
        try {

            const user = await this.usersRepository.getUserAccountByEmail(email);
            if(!user) {
                throw new Error("User Not Found");
            }
            if(user.isBlocked || user.isDeleted) {
                throw new Error("User Account is Blocked or Deleted");
            }

            const dtoUser = this.mapper.mapToDto(user);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(user), {
                EX: 3600 // Set the expiration time to 1 hour
            });
            
            return dtoUser;

        } catch (error) {
            console.error("Error Get User Account By Email:", error);
            throw error;
        }
    }


    public async findAllUsers(): Promise<UsersResponseDto[] | null> {
        try {

            const users = await this.usersRepository.findAllUsers();
            if(!users || users.length === 0) {
                throw new Error("Users Not Found");
            }

            const dtoUsers = users.map(user => this.mapper.mapToDto(user));

            await this.redisClient.set("users", JSON.stringify(dtoUsers), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUsers;
        } catch (error) {
            console.error("Error Find All Users:", error);
            throw error;
        }
    }


    // ============================================================================= Find Pagination User Account Services and Process and Check the Business Logic =========================================================================  //
    public async findAndPaginated(page: number, limit: number): Promise<UsersResponseDto[] | null> {
        try {

            const users = await this.usersRepository.findAndPaginated(page, limit);
            if(!users || users.length === 0) {
                throw new Error("Users Not Found");
            }

            const dtoUsers = users.map(user => this.mapper.mapToDto(user));

            await this.redisClient.set("users", JSON.stringify(dtoUsers), {
                EX: 3600 // Set the expiration time to 1 hour
            });
            
            return dtoUsers;

        } catch (error) {
            console.error("Error Find and Pagination User Account:", error);
            throw error;
        }
    }



    // ======================================================================== Search User Account Services and Process and Check the Business Logic =========================================================================  //
    public async searchUserAccount(search: string): Promise<UsersResponseDto[] | null> {
        try {

            let safeQuery = validateSearchInput(search);
            safeQuery = validateSearchType(safeQuery);
            safeQuery = removeSpecialCharacters(safeQuery);

            const users = await this.usersRepository.searchUserAccount(safeQuery);
            if(!users || users.length === 0) {
                throw new Error(`User Not Found for Search Query: ${safeQuery}`);
            }

            const dtoUsers = users.map(user => this.mapper.mapToDto(user));

            await this.redisClient.set("users", JSON.stringify(dtoUsers), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUsers;
        } catch (error) {
            console.error("Error Search User Account:", error);
            throw error;
        }
    }


    // ===============================================================  Verify User Account Services and Process and Check the Business Logic =========================================================================  //
    public async verifyUserAccountById(id: number): Promise<UsersResponseDto | null> {
        try {

            validateVerifyAccountInput(id.toString(), "");
            validateEmail("");
            validatePasswordInput("");

            const Verify = await this.usersRepository.verifyUserAccountById(id);
            if(!Verify) {
                throw new Error("User Not Found");
            }

            if(!Verify.isVerified) {
                throw new Error("User Account is Already Verified");
            }

            if(!Verify.isBlocked || Verify.isDeleted) {
                throw new Error("User Account is Blocked or Deleted");
            }

            const dtoUser = this.mapper.mapToDto(Verify);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(Verify), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;
 
        } catch (error) {
            console.error("Error Verify User Account:", error);
            throw error;
        }
    }


    // ========================================================================= Block User Account Services and Process and Check the Business Logic =========================================================================  //
    public async blockUserAccountById(id: number): Promise<UsersResponseDto | null> {
        try {

            validateVerifyAccountInput(id.toString(), "");
            validateEmail("");
            validatePasswordInput("");

            const Block = await this.usersRepository.blockUserAccountById(id);
            if(!Block) {
                throw new Error("User Not Found");
            }

            if(Block.isBlocked) {
                throw new Error("User Account is Already Blocked");
            }

            if(Block.isDeleted) {
                throw new Error("User Account is Deleted");
            }

            const dtoUser = this.mapper.mapToDto(Block);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(Block), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;

        } catch (error) {
            console.error("Error Block User Account:", error);
            throw error;
        }
    }


    public async setBlockedUserAccountById(id: number, isBlocked: boolean): Promise<UsersResponseDto | null> {
        try {
            
            const user = await this.usersRepository.setBlockedUserAccountById(id, isBlocked);
            if(!user) {
                throw new Error("User Not Found");
            }
            if(!user.isBlocked) {
                throw new Error("User Account is Already Unblocked");
            }
            if(user.isDeleted) {
                throw new Error("User Account is Deleted");
            }

            const dtoUser = this.mapper.mapToDto(user);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(user), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;

        } catch (error) {
            console.error("Error Set Blocked User Account:", error);
            throw error;
        }
    }


    // ===================================================================== Get User Is Online Services and Process and Check the Business Logic ========================================================================= //
    public async getUserIsOnline(id: number, isOnline: boolean, isBlocked: boolean, isDeleted: boolean, lastLogin: Date): Promise<boolean> {
        try {

            const isUserOnline = await this.usersRepository.getUserIsOnline(id, isOnline, isBlocked, isDeleted, lastLogin);
            if(isUserOnline === undefined) {
                throw new Error("User Not Found");
            }

            if(isOnline && isBlocked || isDeleted ) {
                throw new Error("User Account is Blocked or Deleted");
            }

            if(lastLogin) {
                const lastLoginTime = new Date(lastLogin);
                const currentTime = new Date();
                const timeDifference = (currentTime.getTime() - lastLoginTime.getTime()) / (1000 * 60); // Time difference in minutes
                if (timeDifference > 30) {
                    throw new Error("User is Offline");
                }
            }

            await this.redisClient.set(`user:${id}:isOnline`, JSON.stringify(isUserOnline), {
                EX: 300 // Set the expiration time to 5 minutes
            });

            return isUserOnline;

        } catch (error) {
            console.error("Error Get User Is Online:", error);
            throw error;
        }
    }


    public async updateUserIfLogoutOrOffline(id: number, isOnline: boolean): Promise<boolean> {
        try {

            const isUpdated = await this.usersRepository.updateUserIfLogoutOrOffline(id, isOnline);
            if(!isUpdated || isOnline) {
                throw new Error(`Failed to Update User Online Status or User is Already Online`);
            }
            
            await this.redisClient.set(`user:${id}:isOnline`, JSON.stringify(isOnline), {
                EX: 300 // Set the expiration time to 5 minutes
            });

            return isUpdated;

        } catch (error) {
            console.error("Error Update User If Logout or Offline:", error);
            throw error;
        }
    }


    // ===================================================================== Update User Last Active Status Services and Process and Check the Business Logic ================================================================================== //
    public async updateUserLastActiveStatus(id: number, lastLogin: Date): Promise<boolean> {
        try {

            const isUpdatedStatus = await this.usersRepository.updateUserLastActiveStatus(id, lastLogin);
            if(!isUpdatedStatus || !lastLogin) {
                throw new Error("Failed to Update User Last Active Status or Last Login Time is Required");
            }

            await this.redisClient.set(`user:${id}:lastLogin`, JSON.stringify(lastLogin), {
                EX: 300 // Set the expiration time to 5 minutes
            });                                                                             

            return isUpdatedStatus;

        } catch (error) {
            console.error("Error Update User Last Active Status:", error);
            throw error;
        }
    }

    // ==================================================================== Delete User Account Services and Process and Check the Business Logic =========================================================================  // 
    public async deleteUserAccountById(id: number): Promise<UsersResponseDto | null> {
        try {
            const deletedUser = await this.usersRepository.deleteUserAccountById(id);
            if(!deletedUser || deletedUser.isDeleted) {
                throw new Error("User Not Found or User Account is Already Deleted");
            }

            const dtoUser = this.mapper.mapToDto(deletedUser);

            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(deletedUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;
        } catch (error) {
            console.error("Error Delete User Account:", error);
            throw error;
        }
    }

    // ==================================================================== Forgot Password and Reset Password USer Account Services and Process and Check the Business Logic =========================================================================  //
    public async forgotPassword(id: number, email: string, newPassword: string, token: string): Promise<UsersResponseDto | null> {
        try {
            const payload = await this.authGoogle.verifyGoogleToken(token);
            if(!payload || payload.email !== email) {
                throw new Error("Invalid Google Token");
            }

            const user = await this.usersRepository.getUserAccountByEmail(email);
            if(!user) {
                throw new Error("User Not Found");
            }

            const hashedPassword = await hashPassword(newPassword);

            const updatedUser = await this.usersRepository.updateUserEmailAndPasswordById(id, email, hashedPassword);
            if(!updatedUser) {
                throw new Error("Failed to Update User Email and Password");
            }

            const dtoUser = this.mapper.mapToDto(updatedUser);
            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(updatedUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;
        } catch (error) {
            console.error("Error Forgot Password:", error);
            throw error;
        }
    }

    public async resetPassword(id: number, email: string, newPassword: string, token: string): Promise<UsersResponseDto | null> {
        try {
            const payload = await this.authGoogle.verifyGoogleToken(token);
            if(!payload || payload.email !== email) {
                throw new Error("Invalid Google Token");
            }

            const user = await this.usersRepository.getUserAccountByEmail(email);
            if(!user) {
                throw new Error("User Not Found");
            }

            const hashedPassword = await hashPassword(newPassword);

            const updatedUser = await this.usersRepository.resetPassword(id, email, hashedPassword, token);
            if(!updatedUser) {
                throw new Error("Failed to Reset Password");
            }

            const dtoUser = this.mapper.mapToDto(updatedUser);
            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(updatedUser), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;

        } catch (error) {
            console.error("Error Reset Password:", error);
            throw error;
        }
    }

    // ===================================================================== Login With Google Account User Account Services and Process and Check the Business Logic =========================================================================  //
    public async loginWithGoogleAccount(email: string, firstName: string, lastName: string, password: string, googleId: string, googleToken: string): Promise<UsersResponseDto  | null> {
        try {
            const payload = await this.authGoogle.verifyGoogleToken(googleToken);
            if(!payload || payload.email !== email) {
                throw new Error("Invalid Google Token");
            }

            const hashedPassword = await hashPassword(password);

            const user = await this.usersRepository.loginWithGoogleAccount(email, firstName, lastName, hashedPassword, googleId, googleToken);
            if(!user) {
                throw new Error("Failed to Login With Google Account");
            }
            const dtoUser = this.mapper.mapToDto(user);
            await this.redisClient.set(`user:${dtoUser.id}`, JSON.stringify(user), {
                EX: 3600 // Set the expiration time to 1 hour
            });

            return dtoUser;
        } catch (error) {
            console.error("Error Login With Google Account:", error);
            throw error;
        }
    }

    // ==================================================================== More Features User Account Add this User Services =================================================================== //
    
}