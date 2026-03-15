import UsersChatRooms, { RoomRole } from "../Models/UsersChatRooms";
import { UserChatRoomsRepositoryInterface } from "../Interfaces/UserChatRoomInterface";
import { pool as pg_connection } from "../Config/pg_connection";


export default class UserChatRoomsRepository implements UserChatRoomsRepositoryInterface {
    private pg = pg_connection;

    // =====================================================   Create User Chat Rooms and Save Or Process in the DataBase and Save   ===================================================== //
    async create(userChatRooms: UsersChatRooms): Promise<UsersChatRooms> {
        
        const query = 'INSERT INTO user_chat_rooms (roomId, userId, role, joinedAt, isActive, leftAt, removedAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

        const values = [userChatRooms.roomId, userChatRooms.userId, userChatRooms.role, userChatRooms.joinedAt, userChatRooms.isActive, userChatRooms.leftAt, userChatRooms.removedAt, userChatRooms.updatedAt];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ======================================================= Find All UserChatRooms for a Room ================================================================ //
    async findChatRooms(roomId: string): Promise<UsersChatRooms[]> {
        
        const query = 'SELECT * FROM user_chat_rooms WHERE roomId = $1 AND isActive = TRUE AND removedAt IS NULL AND leftAt IS NULL';

        const values = [roomId];

        const result = await this.pg.query(query, values);

        return result.rows || null;
    }


    // ============================================================================== Find All UserChatRooms for a User ============================================================== //
    async findUserChatRooms(userId: number): Promise<UsersChatRooms[]> {
        
        const query = 'SELECT * FROM user_chat_rooms WHERE userId = $1 AND isActive = TRUE AND removedAt IS NULL AND leftAt IS NULL';

        const values = [userId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ======================================================== Find All UserChatRooms for a User and Room ================================================================ //
    async findUserChatRoomsByRoomId(userId: number, roomId: string): Promise<UsersChatRooms[]> {
        
        const query = 'SELECT * FROM user_chat_rooms WHERE userId = $1 AND roomId = $2 AND isActive = TRUE AND removedAt IS NULL AND leftAt IS NULL';

        const values = [userId, roomId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ============================================================================= Remove User From UserChatRooms and Process in the Database ================================================================ //

    async removeUserFromRoom(userId: number, roomId: string, role: RoomRole): Promise<UsersChatRooms | null> {
        
        const query = 'UPDATE user_chat_rooms SET isActive = false, leftAt = NOW(), removedAt = NOW(), role = $3 WHERE userId = $1 AND roomId = $2 RETURNING *';

        const values = [userId, roomId, role];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
    }


    // ==================================================================================== Update UserChatRooms and Save or Process in the Database ==================================================================================== //

    async updateUserChatRooms(userChatRooms: UsersChatRooms): Promise<UsersChatRooms> {
        
        const query = 'UPDATE user_chat_rooms SET roomId = $1, userId = $2, role = $3,  updatedAt = NOW(),  WHERE id = $4 RETURNING *';

        const values = [userChatRooms.roomId, userChatRooms.userId, userChatRooms.role, userChatRooms.id];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
        
    }
}