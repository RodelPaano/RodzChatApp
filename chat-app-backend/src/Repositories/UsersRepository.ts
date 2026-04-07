import Users, { MessageStatus, UserRole } from "../Models/User";
import { UsersRepositoryInterface } from "../Interfaces/UsersInterface";
import { pool as pg_connection} from "../Config/pg_connection";


export default class UsersRepository implements UsersRepositoryInterface {
    private pg = pg_connection;

            // =================== Create User Account Data=====================
    async createUserAccount (user: Users) : Promise<Users | null> {

        const query = `INSERT INTO users (userName, firstName, middleName, lastName, email, phoneNumber, avatar, password, isVerified, isBlocked, isDeleted, role, address, city, state, zipCode, country, isOnline, statusMessage, lastSeen, lastLogin, friends, blockedUsers, preferences, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *`;

        const values = [
            user.userName,
            user.firstName,
            user.middleName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.avatar,
            user.password,
            user.isVerified,
            user.isBlocked,
            user.isDeleted,
            user.role,
            user.address,
            user.city,
            user.state,
            user.zipCode,
            user.country,
            user.isOnline,
            user.statusMessage,
            user.lastSeen,
            user.lastLogin,
            user.friends,
            user.blockedUsers,
            user.preferences,
            user.createdAt,
            user.updatedAt,
        ];

        const result = await this.pg.query(query, values);
        
        return result.rows[0] || null;
        
    };


    // =================== Login User Account Data =====================

    async loginUserAccount (email: string, password: string) : Promise<Users | null> {

        const query = `SELECT * FROM users WHERE email = $1 AND password = $2`;

        const values = [email, password];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };


    // =================== Update the User Details Account Repository =====================
    async updateUserDetailsAccountById(id: number, user: Users): Promise<Users | null> {
        
        const query = `UPDATE users SET userName = $1, firstName = $2, middleName = $3, lastName = $4,  phoneNumber = $5, avatar = $6, address = $7, city = $8, state = $9, zipCode = $10, country = $11,  updatedAt = $12 WHERE id = $13 RETURNING *`;

        const values = [
            user.userName,
            user.firstName,
            user.middleName,
            user.lastName,
            user.phoneNumber,
            user.avatar,
            user.address,
            user.city,
            user.state,
            user.zipCode,
            user.country,
            user.updatedAt,
            id
        ];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };

    // =================== Update User Role Repository =====================
    async updateUserRole(id: number, role: UserRole) : Promise<Users | null> {

        const query = `UPDATE users SET role = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;

        const values = [
            role,
            new Date(),
            id
        ];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };

    // =================== Update User Email And Password By Id Repository =====================
    async updateUserEmailAndPasswordById(id: number, email: string, password: string) : Promise<Users | null>  {

        const query = `UPDATE users SET email = $1, password = $2, updatedAt = $3 WHERE id = $4 RETURNING *`;
        const values = [
            email,
            password,
            new Date(),
            id
        ];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };


    // =================== Get User Account By Id Repository =====================
    async getUserAccountById(id: number) : Promise<Users | null> {

        const query = `SELECT * FROM users WHERE id = $1`;

        const values = [id];

        const result = await this.pg.query(query, values);
        return result.rows[0] || null;
    };

    async getUserAccountByEmail(email: string): Promise<Users | null> {
        
        const query = `SELECT * FROM users WHERE email = $1`;

        const values = [email];

        const result = await this.pg.query(query, values);
        return result.rows.length >0 ? result.rows[0] : null;
    };

    // =================== Find All Users Repository =====================
    async findAllUsers(): Promise<Users[] | null> {
        
        const query = `SELECT * FROM users  WHERE isDeleted = false`;

        const result = await this.pg.query(query);
        return result.rows.length >0 ? result.rows : null;
    };

    // =================== Find And Paginated Users Repository =====================
    async findAndPaginated(page: number, limit: number): Promise<Users[] | null> {
        const offset = (page - 1) * limit;

        const query = `SELECT * FROM users WHERE isDeleted = false ORDER BY id LIMIT $1 OFFSET $2`;

        const values = [limit, offset];

        const result = await this.pg.query(query, values);
        return result.rows.length >0 ? result.rows : null;
    };


    // =================== Search User Account Repository =====================
    async searchUserAccount(search: string): Promise<Users[] | null> {
        
        const query = `SELECT * FROM users WHERE (userName ILIKE $1 OR firstName ILIKE $1 OR lastName ILIKE $1 OR email ILIKE $1) AND isDeleted = false`;

        const values = [`%${search}%`];

        const result = await this.pg.query(query, values);
        return result.rows.length >0 ? result.rows : null;
    };

    // =================== Verify User Account By Id Repository =====================
    async verifyUserAccountById(id: number): Promise<Users | null> {
        
        const query = `UPDATE users SET isVerified = true, updatedAt = $1 WHERE id = $2 RETURNING *`;

        const values = [new Date(), id];
        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };

    // =================== Block User Account By Id Repository =====================
    async blockUserAccountById(id: number): Promise<Users | null> {
        
        const query = `UPDATE users SET isBlocked = true, updatedAt = $1 WHERE id = $2 RETURNING *`;

        const values = [new Date(), id];

        const result = await this.pg.query(query, values);
        return result.rows[0] || null;
    };

    // =================== Set Blocked User Account By Id Repository =====================
    async setBlockedUserAccountById(id: number, isBlocked: boolean): Promise<Users | null> {
        
        const query = `UPDATE users SET isBlocked = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;

        const values = [isBlocked, new Date(), id];
        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    };


    // =================== Get User Is Online Repository =====================
    async getUserIsOnline(id: number, isOnline: boolean, isBlocked: boolean, isDeleted: boolean, lastLogin: Date): Promise<boolean> {
        
        const query = ` SELECT * FROM users WHERE id = $1 AND isOnline = $2 AND isBlocked = $3 AND isDeleted = $4 AND lastLogin >= NOW() - INTERVAL '30 minutes'`;

        const values = [id, isOnline, isBlocked, isDeleted,  new Date()];
        const result = await this.pg.query(query, values);

        return result.rows[0]?.isOnline || false;
    };


    // =================== Update User If Logout Or Offline Repository =====================
    async updateUserIfLogoutOrOffline(id: number, isOnline: boolean): Promise<boolean> {
        
        const query = ` UPDATE users SET isOnline = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;

        const values = [isOnline, new Date(), id];
        const result = await this.pg.query(query, values);
        return result.rows.length > 0;
    };

    // =================== Update User Last Active Status Repository =====================
    async updateUserLastActiveStatus(id: number, lastLogin: Date): Promise<boolean> {
        
        const query = ` UPDATE users SET lastLogin = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;

        const values = [lastLogin, new Date(), id];
        const result = await this.pg.query(query, values);
        return result.rows.length > 0;
    };

    // =================== Update User Message Status Repository =====================
    async updateUserMessageStatus(id: number, messageStatus: MessageStatus): Promise<MessageStatus> {
        
        const query = ` UPDATE users SET statusMessage = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;

        const values = [messageStatus, new Date(), id];
        const result = await this.pg.query(query, values);
        return result.rows[0]?.statusMessage ?? null;
    };

    //  =================== Delete User Account By Id Repository =====================
    async deleteUserAccountById(id: number): Promise<Users | null> {
        
        const query = `DELETE FROM users WHERE id = $1 RETURNING *`;

        const values = [id];
        const result = await this.pg.query(query, values);
        return result.rows[0] || null;
    }    


    async resetPassword(id: number, email: string, newPassword: string, token: string): Promise<Users | null> {
        
        const query = `UPDATE users SET password = $1, updatedAt = $2 WHERE id = $3 AND email = $4 RETURNING *`;

        const values = [newPassword, new Date(), id, email];
        const result = await this.pg.query(query, values);
        return result.rows[0] || null;
    }

    // ==================== Login With Google Account Repository =====================
    async loginWithGoogleAccount(email: string, firstName: string, lastName: string, password: string, googleId: string, googleToken: string): Promise<Users | null> {
        const query = `INSERT INTO users (email, firstName, lastName, password, googleId, googleToken, isVerified, role, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, true, 'user', $7, $8) ON CONFLICT (email) DO UPDATE SET googleId = EXCLUDED.googleId, googleToken = EXCLUDED.googleToken RETURNING *`;

        const values = [email, firstName, lastName, password, googleId, googleToken, new Date(), new Date()];
        const result = await this.pg.query(query, values);
        return result.rows[0] || null;
    }


    // More Function Add in the Repository
} 