    import Messages  from "../Models/Messages";
    import { MessagesRepositoryInterface } from "../Interfaces/MessagesInterfaces";
    
    import { Media } from "../Models/Rooms";
    import { pool as pg_connection } from "../Config/pg_connection";

    export default class MessagesRepository implements MessagesRepositoryInterface {
        private pg = pg_connection;
        // ============================================= Send an Message, and sendMultipleMessagesToAllFriends and sendMessageToRoom Post to the database and send back the Message Model =================================================================== //
        async sendMessage(senderId: number, receiverId: number,  message: Messages, mediaFile: Media[]): Promise<Messages> {
            
            const query = 'INSERT INTO messages (senderId, receiverId, uploadedBy, message, media, createdAt) VALUES ($1, $2, $3, $4) RETURNING *';
            const values  = [senderId, receiverId, message.message, message.media, ];

            const result = await this.pg.query(query, values);
            const savedMessage = result.rows[0];

            // Save Media File to the Postgres Database
            const savedMedia: Media[] = [];

            for (const media of mediaFile) {

                const mediaQuery = `INSERT INTO media (
                messageId,
                type,
                url,
                uploadedAt,
                uploadedBy)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING * `;

                const mediaValues = [
                    savedMessage.id,
                    media.type,
                    media.url,
                    media.uploadedAt || new Date(),
                    media.uploadedBy
                ];


                const mediaResult = await this.pg.query(mediaQuery, mediaValues);

                const savedMediaFile = mediaResult.rows[0];

                savedMedia.push(savedMediaFile);
            }

            return {
                ...savedMessage,
                media:savedMedia
            }
        }

        // ===================================================== Send Multiple Message to All Friends ==================================================================================================== //
        async sendMultipleMessagesToAllFriends(senderId: number, receiverIds: number[], message: Messages, mediaFile: Media[]): Promise<{sent: Messages[];blocked: number[];failed: number}> {
            
            const sent: Messages[] = [];
            let failedCount = 0;

            for (const receiverId of receiverIds) {
                try {
                    // ── Insert Message ────────────────────────────────────────
                    const query = `
                        INSERT INTO messages (senderId, receiverId, message, createdAt) 
                        VALUES ($1, $2, $3, $4) 
                        RETURNING *
                    `;
                    const values = [
                        senderId,
                        receiverId,
                        message.message,
                        message.createdAt || new Date()
                    ];

                    const result = await this.pg.query(query, values);
                    const savedMessage: Messages = result.rows[0];

                    // ── Insert Media Per Message ───────────────────────────────
                    if (mediaFile && mediaFile.length > 0) {
                        for (const media of mediaFile) {
                            const mediaQuery = `
                                INSERT INTO media (messageId, type, url, uploadedAt, uploadedBy) 
                                VALUES ($1, $2, $3, $4, $5)
                            `;
                            const mediaValues = [
                                savedMessage.id,
                                media.type,
                                media.url,
                                media.uploadedAt || new Date(),
                                media.uploadedBy
                            ];
                            await this.pg.query(mediaQuery, mediaValues);
                        }
                    }

                    sent.push(savedMessage);  // ✅ Push after success

                } catch (error) {
                    
                    failedCount++;
                    console.error(`Failed to send message to receiver ${receiverId}:`, error);
                }
            }

            return {
                sent,
                blocked: [],  // ← block check is handled in service layer na
                failed: failedCount,
            };
    }


        // ======================================================== Send Message To Room ======================================================= //
        async sendMessageToRoom(roomId: number, senderId: number, message: Messages, mediaFile: Media[]): Promise<Messages> {
            
            const query = 'INSERT INTO messages (roomId, senderId, message, media, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values  = [roomId, senderId, message.message, message.media, message.createdAt || new Date()];

            const result = await this.pg.query(query, values);
            const savedMessage = result.rows[0];

            // Save Media File to the Postgres Database
            const savedMedia: Media[] = [];

            // for Loop for saving or inserting Media
            for (const media of mediaFile) {

                const mediaQuery = `INSERT INTO media (
                messageId,
                type,
                url,
                uploadedAt,
                uploadedBy
                ) VALUES ($1, $2, $3, $4, $5) 
                 RETURNING * `;

                 const mediaValues  = [
                    savedMessage.id,
                    media.type,
                    media.url,
                    media.uploadedAt || new Date(),
                    media.uploadedBy
                 ];
                  const mediaResult = await this.pg.query(mediaQuery, mediaValues);

                  const savedMediaFile = mediaResult.rows[0];

                  savedMedia.push(savedMediaFile);
            }

            // Returning saved Message With Media File
            return {
                ...savedMessage,
                media: savedMedia
            };

        }

        // ================================================ Reply to Message From Receiver To Sender ========================================================= //
        async replyToMessageFromReceiverToSender(senderId: number, receiverId: number, message: Messages, replyAt: Date, mediaFile: Media[]): Promise<Messages[]> {
            
            const query = 'INSERT INTO messages (senderId, receiverId, message, media, replyAt, createdAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const values  = [senderId, receiverId, message.message, message.media, replyAt, message.createdAt || new Date()];

            const result = await this.pg.query(query, values);
            const savedMessage = result.rows[0];

            // Save Media File to the Postgres Database
            const savedMedia: Media[] = [];

            for (const media of mediaFile) {

                const mediaQuery = `INSERT INTO media (
                messageId,
                type,
                url,
                uploadedAt,
                uploadedBy
                ) VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`;

                 const mediaValues = [
                    savedMessage.id,
                    media.type,
                    media.url,
                    media.uploadedAt || new Date(),
                    media.uploadedBy
                 ];

                 const mediaResult = await this.pg.query(mediaQuery, mediaValues);

                 const savedMediaFile = mediaResult.rows[0];

                 savedMedia.push(savedMediaFile);
            }

            // Return Result Message With media
            return {
                ...savedMessage,
                media: savedMedia
            }
        }

        // ======================================================== Reply to Message From Room By Sender to Receivers ======================================================== //
        async replyToMessageFromRoomBySenderToReceivers(roomId: number, senderId: number, message: Messages, replyAt: Date, mediaFile: Media[]): Promise<Messages[]> {
            
            const query = 'INSERT INTO messages (roomId, senderId, message, media, replyAt, createdAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const values  = [roomId, senderId, message.message, message.media, replyAt, message.createdAt || new Date()];

            const result = await this.pg.query(query, values);
            const savedMessage = result.rows[0];

            // Save Media File to the Postgres Database
            const savedMedia: Media[] = [];

            for (const media of mediaFile) {
                const mediaQuery = `INSERT INTO media (
                messageId,
                type,
                url,
                uploadedAt,
                uploadedBy) 
                VALUES ($1, $2, $3, $4, $) RETURNING *`;


                const mediaValues = [
                    savedMessage.id,                    
                    media.type,
                    media.url,
                    media.uploadedAt || new Date(),
                    media.uploadedBy
                ]

                const mediaResult = await this.pg.query(mediaQuery, mediaValues);

                savedMedia.push(mediaResult.rows[0]);

            }
            
            return {
                ...savedMessage,
                media: savedMedia
            }

        }


        // ============================================== Get All Messages By List By User Id ============================================= //
        async getMessageBySenderIdToReceiverId(id: number, senderId: number, receiverId: number, readAt: Date): Promise<(Messages & { media: Media[] }) | null> {
            // Get the message
            const query = 'SELECT * FROM messages WHERE id = $1 AND (senderId = $2 AND receiverId = $3 AND uploadedBy = $4, readAt = $5) OR (senderId = $3 AND receiverId = $2 AND uploadedBy = $4 readAt = $5)';
            
            const values = [id, senderId, receiverId, readAt];

            const result = await this.pg.query(query, values);

            const message = result.rows[0];

            if(!message) {
                return null;
            }

            const mediaQuery = `SELECT * FROM media WHERE messageId = $1 AND uploadedAt = $2`;

            // Attach media per Message
            const mediaResult = await this.pg.query(mediaQuery, 
                [message.messageId, message.uploadedAt]
            );

            // Return Message With Media
            return {
                ...message,
                media: mediaResult.rows
            };
        }

        // ========================================================= Get or Retrieve Message By Receiver ID ======================================================= //
        async getMessagesByReceiverId(senderId: number, receiverId: number, readAt: Date, offset: number): Promise<(Messages & { media: Media[] }) [] > {
            
            const query = `
            SELECT * FROM messages 
            WHERE receiverId = $1 AND senderId = $2 AND readAt < $3
            ORDER BY createdAt DESC 
            LIMIT 10 OFFSET $4
            `;
            const values = [senderId, receiverId, readAt, offset];
            const result = await this.pg.query(query, values);
            

            const mediaQuery = `SELECT * FROM media WHERE messageId = $1 AND uploadedBy = $2`;

            // Attach media per message
            const messageWithMedia: (Messages & {media: Media[]}) [] = [];

            for (let i = 0; i < result.rows.length; i ++) {
                const messages = result.rows[i];

                const mediaResult = await this.pg.query(mediaQuery, 
                    [messages.messageId, messages.uploadedBy]
                );

                messageWithMedia.push({
                    ...messages,
                    media: mediaResult.rows
                })
            }

            return messageWithMedia;


        }


        // ================================================== Get or Retrieve Message To Room or Group Chat By Sender ID ====================================================== //
        async getMessagesByRoomIdOrGroupChat(roomId: number, senderId: number, receiverIds: number[], readAt: Date, offset: number): Promise<(Messages & { media: Media[] }) []> {
            
            const query = `
            SELECT * FROM messages 
            WHERE roomId = $1 AND senderId = $2 AND uploadedBy = $3 AND readAt < $4
            ORDER BY createdAt DESC 
            LIMIT 10 OFFSET $5
            `;
            const values = [roomId, senderId, receiverIds, readAt, offset];
            const result = await this.pg.query(query, values);

            // Saved Media per Message
            const mediaQuery = `SELECT * FROM media WHERE messageId = $1 AND uploadedBy = $2`;

            const messageWithMedia: (Messages & {media: Media[]}) [] = [];

            for (let i = 0; i < result.rows.length; i ++) {
                const messages = result.rows[i];

                const mediaResult = await this.pg.query(mediaQuery, 
                    [messages.messageId, messages.uploadedBy]
                );

                messageWithMedia.push({
                    ...messages,
                    media: mediaResult.rows
                });
            }

            return messageWithMedia;

        }


        // ============================================== Delete Message By ID ===================================================================//
        async deleteOrRemoveMessageByRoomId(roomId: number, messageId: number, senderId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]): Promise<boolean> {
            
            let query: string;
            let values: any[];
            
            if(isHardDelete) {
                query = 'DELETE FROM messages WHERE roomId = $1 AND messageId = $2 RETURNING *';
                values = [roomId, messageId];
            } else {
                query = 'UPDATE messages SET deletedAt = $1, message = $2, media = $3 WHERE roomId = $4 AND messageId = $5 RETURNING *';
                values = [deletedAt || new Date(), message.message, message.media, roomId, messageId];
            }

            const result = await this.pg.query(query, values);
            const deletedMessage = result.rows[0];
            if (!deletedMessage) return false;

            // Delete media linked to this message
            if(isHardDelete) {
                for (const media of mediaFile) {
                    const mediaQuery = `DELETE FROM media WHERE messageId = $1 AND type = $2 AND url = $3 AND uploadedBy = $4`;
                    const mediaValues = [messageId, media.type, media.url, media.uploadedBy];
                    await this.pg.query(mediaQuery, mediaValues);
                }
            }
            return true;
        }


        // ================================================== Delete or Remove Message to Friend By Message ID ========================================================================= //
        async deleteOrRemoveMessageToUserOrFriendByMessageId(messageId: number, senderId: number, receiverId: number, message: Messages, isHardDelete: boolean, deletedAt: Date, mediaFile: Media[]): Promise<boolean> {
            
            let query: string;
            let values: any[];

            if(isHardDelete) {
                query = 'DELETE FROM messages WHERE (senderId = $1 AND receiverId = $2) OR (senderId = $2 AND receiverId = $1) AND messageId = $3 RETURNING *';
                values = [senderId, receiverId, messageId];
            } else {
                query = 'UPDATE messages SET deletedAt = $1, message = $2, media = $3 WHERE (senderId = $4 AND receiverId = $5) OR (senderId = $4 AND receiverId = $5) AND messageId = $6 RETURNING *';
                values = [deletedAt || new Date(), message.message, message.media, senderId, receiverId, messageId];
            }
            const result = await this.pg.query(query, values);
            const deletedMessage = result.rows[0];
            if (!deletedMessage) return false;

            // Delete media linked to this message
            if(isHardDelete) {
                for (const media of mediaFile) {
                    const mediaQuery = `DELETE FROM media WHERE messageId = $1 AND type = $2 AND url = $3 AND uploadedBy = $4`;
                    const mediaValues = [messageId, media.type, media.url, media.uploadedBy];
                    await this.pg.query(mediaQuery, mediaValues);
                }
            }
            return true;
        }


        // ============================================== Update Message By ID =======================================================================//
        async updateMessageById(id: number, senderId: number, receiverId: number, readAt: Date, message: Messages, updatedAt: Date): Promise<Messages | null> {
            
            const query = 'UPDATE messages SET message = $1, media = $2, readAt = $3, updatedAt = $4 WHERE id = $5 AND senderId = $6 AND receiverId = $7 RETURNING *';
            const values = [message.message, message.media, readAt, updatedAt, id, senderId, receiverId];

            const result = await this.pg.query(query, values);
            return result.rows[0] || null;
        }

        
        // ================================================== Update Message By Room ID =================================================================== //
        async updateMessageByRoomId( id: number,roomId: number, senderId: number, readAt: Date,message: Messages, updatedAt: Date): Promise<Messages | null> {
            
            const query = 'UPDATE messages SET message = $1, media = $2, readAt = $3, updatedAt = $4 WHERE roomId = $5 AND id = $6 RETURNING *';
            const values = [message.message, message.media, readAt, updatedAt, roomId, id];

            const result = await this.pg.query(query, values);

            return result.rows[0] || null;
        }

        // ============================== More Features Add here in this Message Repository ================================


    }