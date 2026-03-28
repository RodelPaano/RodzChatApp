import ChatRooms from "../Models/Rooms";
import { ChatRoomsRepositoryInterface } from "../Interfaces/ChatRoomsInterfaces";
import { pool as pg_connection } from "../Config/pg_connection";


export default class ChatRoomsRepository implements ChatRoomsRepositoryInterface {
    private pg = pg_connection;


    // ======================================================= Create ChatRooms and Save Or Process in the DataBase and Save ========================================================================= //
    async createChatRoom(name: string, description: string, icon: string, ownerId: number, createdAt: Date): Promise<ChatRooms> {
        
        const query = 'INSERT INTO chat_rooms (name, description, icon, ownerId, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [name, description, icon, ownerId, createdAt];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // ================================================================ Update ChatRooms and Save or Process in the DataBase and Save ================================================================ //
    async updateNameAndIconByIdWhereBelongToOwnerId(id: number, name: string, icon: string, ownerId: number, updatedAt: Date): Promise<ChatRooms | null> {
        
        const query = 'UPDATE chat_rooms SET name = $1, icon = $2, updatedAt = $3 WHERE id = $4 AND ownerId = $5 RETURNING *';
        const values = [name, icon, updatedAt, id, ownerId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    async updateDescriptionByIdWhereBelongToOwnerId(id: number, description: string, ownerId: number, updatedAt: Date): Promise<ChatRooms | null> {
        
        const query = 'UPDATE chat_rooms SET description = $1, updatedAt = $2 WHERE id = $3 AND ownerId = $4 RETURNING *';
        const values = [description, updatedAt, id, ownerId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // =============================================================== Delete ChatRooms and Save or Process in the DataBase and Save ================================================================ //
    async deleteChatRoomByIdWhereBelongToOwnerId(id: number, ownerId: number, deletedAt: Date): Promise<ChatRooms | null> {
        
        const query = 'UPDATE chat_rooms SET deletedAt = $1 WHERE id = $2 AND ownerId = $3 RETURNING *';
        const values = [deletedAt, id, ownerId];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }


    // =============================================================== Find ChatRooms and Save or Process in the DataBase and Save ================================================================ //
    async findChatRoomById(id: number): Promise<ChatRooms | null> {
        
        const query = 'SELECT * FROM chat_rooms WHERE id = $1';
        const values = [id];

        const result = await this.pg.query(query, values);

        return result.rows[0] || null;
    }

    async findAllChatRooms(): Promise<ChatRooms[]> {
        
        const query = 'SELECT * FROM chat_rooms';
        const result = await this.pg.query(query);
        return result.rows;
    }


    async findChatRoomsByOwnerId(ownerId: number): Promise<ChatRooms[]> {
        
        const query = 'SELECT * FROM chat_rooms WHERE ownerId = $1';
        const values = [ownerId];

        const result = await this.pg.query(query, values);

        return result.rows;
    }
    

    // =============================================================== More function name and Save or Process in the DataBase and Save ================================================================ //(params:type) {
    
    
}   