import UsersResponseDto from "../Dtos/UsersDto";
import { UsersAutoMapperInterface } from "../Interfaces/UsersInterface";
import { CreateUserInput } from "../Helper/InputField";
import Users, { UserRole } from "../Models/User";

export default class UsersAutoMapper implements UsersAutoMapperInterface {
    mapToModel(input: CreateUserInput, hashedPassword: string) : Users {
        return new Users (
            0,
            input.userName,
            input.firstName,
            input.middleName || "",
            input.lastName,
            input.email,
            input.phoneNumber || "",
            input.avatar || "",
            hashedPassword, // hashed password must be provided by service
            false,
            false,
            false,
            input.role as unknown as UserRole,
            input.address || "",
            input.city || "",
            input.state || "",
            input.zipCode || "",
            input.country || "",
            false,
            input.preferences?.statusMessage || "sent",
            new Date(),
            new Date(),
            [],
            [],
            input.preferences || {},
            new Date(),
            new Date()


        );
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