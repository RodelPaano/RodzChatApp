import ChatRooms, {Media} from "../Models/Rooms";
import { ChatRoomsRepositoryInterface } from "../Interfaces/ChatRoomsInterfaces";
import { pool as pg_connection } from "../Config/pg_connection";
import UsersChatRooms, { RoomRole } from "../Models/UsersChatRooms";
import Users from "../Models/User";

export default class ChatRoomsRepository implements ChatRoomsRepositoryInterface {
    private pg = pg_connection;


    // ======================================================= Create ChatRooms and Save Or Process in the DataBase and Save ========================================================================= //
    async create(chatRoom: ChatRooms): Promise<ChatRooms> {
         
        const query = 'INSERT INTO chat_rooms (name, description, icon, ownerId, members, media, createdAt, updatedAt, deletedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const values = [chatRoom.name, chatRoom.description, chatRoom.icon, chatRoom.ownerId, chatRoom.members, chatRoom.media, chatRoom.createdAt || new Date(), chatRoom.updatedAt || new Date(), chatRoom.deletedAt || null];

        const result = await this.pg.query(query, values);

        return result.rows[0];
    }


    // ================================================================ Add User and Remove User in ChatRooms and Save or Process in the DataBase and Save ================================================================ //

    async addUserToChatRoom(chatRoomId: number, userId: number): Promise<boolean> {
        
        const query = 'INSERT INTO user_chat_rooms (userId, roomId, role, isActive, joinedAt, removedAt, leftAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const values = [userId, chatRoomId, RoomRole.Member, true, new Date(), null, null, new Date()];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }


    async removeUserFromChatRoom(chatRoomId: number, userId: number): Promise<boolean> {
        
        const query = 'UPDATE user_chat_rooms SET isActive = FALSE, removedAt = NOW() WHERE roomId = $1 AND userId = $2 RETURNING *';

        const values = [chatRoomId, userId];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }

    // ======================================================= Get Member in ChatRooms and Save or Process in the DataBase and Save ========================================================================= //
    async getUsersInChatRoom(chatRoomId: number): Promise<Users[]> {
        
        const query = 'SELECT u.*, uc.role, uc.joinedAt FROM users u INNER JOIN user_chat_rooms uc. ON  u.id = uc.userId WHERE UC.roomId = $1 AND uc.isActive = TRUE AND uc.removedAt IS NULL AND uc.leftAt IS NULL';

        const values = [chatRoomId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }
    

    // =============================================================== Read ChatRooms and Save or Process in the DataBase and Save ================================================================ //
    async findAll(): Promise<ChatRooms[]> {
        
        const query = 'SELECT * FROM chat_rooms WHERE deletedAt IS NULL';
        const result = await this.pg.query(query);

        return result.rows;
    }

    async findById(id: number): Promise<ChatRooms | null> {
        
        const query = 'SELECT * FROM chat_rooms WHERE id = $1 AND deletedAt IS NULL';
        const values = [id];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ====================================================  Media Handler and Save or Process in the DataBase and Save ==================================================== //
    async addMediaToChatRoom(roomId: number, media: Media): Promise<boolean> {
        
        const query = 'INSERT INTO media (id, roomId, type, url, uploadedBy, uploadedAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

        const values = [media.id, roomId, media.type, media.url, media.uploadedBy, media.uploadedAt || new Date()];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }


    async removeMediaFromChatRoom(roomId: number, mediaId: number): Promise<boolean> {
        
        const query = 'DELETE FROM  media WHERE roomId = $1 AND id = $2 RETURNING *';

        const values = [roomId, mediaId];

        const  result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }

    async getMediaFromChatRoom(roomId: number): Promise<Media[]> {
        
        const query = 'SELECT * FROM media WHERE roomId = $1 AND deletedAt IS NULL';
        const values = [roomId];

        const result = await this.pg.query(query, values);

        return result.rows[0].media;
    }

    async downloadMediaFromChatRoom(roomId: number, mediaId: number): Promise<Media | null> {
        
        const query = 'SELECT * FROM media WHERE roomId = $1 AND id = $2 AND deletedAt IS NULL';
        const values = [roomId, mediaId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // =============================================================== Update ChatRooms and Save or Process in the DataBase and Save ================================================================ //
    async update(id: number, chatRoom: Partial<ChatRooms>): Promise<ChatRooms | null> {
        
        const query = 'UPDATE chat_rooms SET name = $1, description = $2, icon = $3, ownerId = $4, updatedAt = NOW() WHERE id = $5 RETURNING *';
        const values = [chatRoom.name, chatRoom.description, chatRoom.icon, chatRoom.ownerId, id];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    /* ============================================================== Delete ChatRooms and Save or Process in the DataBase and Save ==============================================================
    ================================== Soft Delete ChatRooms and Save or Process in the DataBase and Save ============================================================== 
    */
    async delete(id: number): Promise<boolean> {
        
        const query = 'UPDATE chat_rooms SET deletedAt = NOW() WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }


    // ===================================================================== Hard Delete ChatRooms and Save or Process in the DataBase and Save ===================================================================== //
    async hardDelete(id: number): Promise<boolean> {
        
        const query = 'DELETE FROM chat_rooms WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await this.pg.query(query, values);

        return (result.rowCount ?? 0) > 0;
    }

    // =============================================================== More function name and Save or Process in the DataBase and Save ================================================================ //(params:type) {
    
    
}   