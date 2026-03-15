    import Messages  from "../Models/Messages";
    import { MessagesRepositoryInterface } from "../Interfaces/MessagesInterfaces";
    
    import { Media } from "../Models/Rooms";
    import { pool as pg_connection } from "../Config/pg_connection";

    export default class MessagesRepository implements MessagesRepositoryInterface {
        private pg = pg_connection;
        // ============================================= Send an Message, and sendMultipleMessagesToAllFriends and sendMessageToRoom Post to the database and send back the Message Model =================================================================== //
        async sendMessage(senderId: number, receiverId: number, message: Messages): Promise<Messages> {
            
            const query = 'INSERT INTO messages (senderId, receiverId, message, media, createdAt) VALUES ($1, $2, $3, $4) RETURNING *';
            const values  = [senderId, receiverId, message.message, message.media, message.createdAt || new Date()];

            const result = await this.pg.query(query, values);
            return result.rows[0];
        }


        async sendMultipleMessagesToAllFriends(senderId: number, receiverId: number[], message: Messages): Promise<Messages[]> {
            
            const results: Messages[] = [];

            for (const receiver of receiverId) {
                const query = `INSERT INTO messages (senderId, receiverId, message, media, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                const values  = [senderId, receiver, message.message, message.media, message.createdAt || new Date()];

                const result = await this.pg.query(query, values);
                results.push(result.rows[0]);
            }

            return results;
        }


        async sendMessageToRoom(roomId: number, senderId: number, message: Messages): Promise<Messages> {
            
            const query = 'INSERT INTO messages (roomId, senderId, message, media, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values  = [roomId, senderId, message.message, message.media, message.createdAt || new Date()];

            const result = await this.pg.query(query, values);
            return result.rows[0];

        }


        // ============================================== Get All Messages By List By User Id ============================================= //
        async getMessageById(id: number): Promise<Messages | null> {
            
            const query = 'SELECT * FROM messages WHERE messageId = $1';
            const values = [id];

            const result = await this.pg.query(query, values);
            return result.rows[0] || null;
        }

        async getMessagesByReceiverId(senderId: number, receiverId: number, offset: number): Promise<Messages[]> {
            
            const query = 'SELECT * FROM messages WHERE (senderId = $1 And receiverId = $2) OR (senderId = $2 And receiverId = $1) ORDER BY createdAt DESC LIMIT 10 OFFSET $3';
            const values = [senderId, receiverId, offset];

            const result = await this.pg.query(query, values);
            return result.rows;

        }

        async getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, offset: number): Promise<Messages[]> {
            
            const query = 'SELECT * FROM messages WHERE roomId = $1 AND senderId = $2 ORDER BY createdAt DESC LIMIT 10 OFFSET $2';
            const values = [roomId, senderId, offset];

            const result = await this.pg.query(query, values);
            return result.rows;
        }


        // ============================================== Delete Message By ID ===================================================================//
        async deleteOrRemoveMessageByRoomId(roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date): Promise<boolean> {
            
            let query: string;
            let values: any[];

            if(isHardDelete) {
                query = 'DELETE FROM messages WHERE roomId = $1 AND senderId = $2 AND messageId = $3 RETURNING *';
                values = [roomId, senderId, messageId];
            } else {
                query = 'UPDATE messages SET message = $1, media = $2 , deletedAt = $6 WHERE roomId = $3 AND senderId = $4 AND messageId = $5 RETURNING *';
                values = [message.message, message.media, roomId, senderId, messageId, deletedAt || new Date()];
            }

            const result = await this.pg.query(query, values);
            return (result.rowCount ?? 0) > 0; 
        }
    
        async deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date): Promise<boolean> {
            
            let query: string;
            let values: any[];

            if(isHardDelete) {
                query = 'DELETE FROM messages WHERE (senderId = $1 AND receiverId = $2) OR (senderId = $2 AND receiverId = $1) AND messageId = $3 RETURNING *';
                values = [senderId, receiverId, messageId];
            } else {
                query = 'UPDATE messages SET deletedAt = $6, message = $1, media = $2 WHERE (senderId = $3 AND receiverId = $4) OR (senderId = $4 AND receiverId = $3) AND messageId = $5 RETURNING *';
                values = [message.message, message.media, senderId, receiverId, messageId, deletedAt || new Date()];
            }

            const result = await this.pg.query(query, values);

            return (result.rowCount ?? 0) > 0;
        }


        // ============================================== Update Message By ID =======================================================================//
        async updateMessageById(messageId: number, senderId: number, receiverId: number, message: Messages, updatedAt: Date): Promise<Messages | null> {
            
            const query = 'UPDATE messages SET message = $1, media = $2, updatedAt = $3 WHERE ((senderId = $4 AND receiverId = $5) OR (senderId = $5 AND receiverId = $4)) AND id = $6 RETURNING *';
            const values = [message.message, message.media, updatedAt, senderId, receiverId, messageId];

            const result = await this.pg.query(query, values);
            return result.rows[0] || null;
        }

        
        async updateMessageByRoomId(roomId: number, senderId: number, message: Messages, updatedAt: Date): Promise<Messages | null> {
            
            const query = 'UPDATE messages SET message = $1, media = $2, updatedAt = $3 WHERE ((senderId = $4 AND roomId = $5) OR (senderId = $5 AND roomId = $4)) RETURNING *';
            const values = [message.message, message.media, updatedAt, senderId, roomId];

            const result = await this.pg.query(query, values);

            return result.rows[0] || null;
        }

        // ============================== More Features Add here in this Message Repository ================================


    }