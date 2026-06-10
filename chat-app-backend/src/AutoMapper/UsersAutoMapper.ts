import UsersResponseDto from "../Dtos/UsersDto";
import { UsersAutoMapperInterface } from "../Interfaces/UsersInterface";
import { CreateUserInput } from "../Helper/InputField";
import Users, { UserRole } from "../Models/User";

export default class UsersAutoMapper implements UsersAutoMapperInterface {
    mapToModel(input: CreateUserInput, hashedPassword: string) : Users {
        const user = Object.assign(Object.create(Users.prototype), {
            id: 0,
            userName: input.userName,
            firstName: input.firstName,
            middleName: input.middleName || "",
            lastName: input.lastName,
            email: input.email,
            phoneNumber: input.phoneNumber || "",
            avatar: input.avatar || "",
            password: hashedPassword, // hashed password must be provided by service
            isVerified: false,
            isBlocked: false,
            isDeleted: false,
            role: input.role as unknown as UserRole,
            address: input.address || "",
            city: input.city || "",
            state: input.state || "",
            zipCode: input.zipCode || "",
            country: input.country || "",
            isOnline: false,
            statusMessage: input.preferences?.statusMessage || "sent",
            lastSeen: new Date(),
            lastLogin: new Date(),
            friends: [],
            blockedUsers: [],
            preferences: input.preferences || {},
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as Users;

        return user;
    }

    mapToDto(user: Users) : UsersResponseDto {
        return {
            id: user.id,
            userName: user.userName,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            isDeleted: user.isDeleted,
            role: user.role as unknown as UserRole,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,            
            isOnline: user.isOnline,
            statusMessage: user.statusMessage,
            lastSeen: user.lastSeen,
            lastLogin: user.lastLogin,
            friends: user.friends,
            blockedUsers: user.blockedUsers,
            preferences: user.preferences,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }


}