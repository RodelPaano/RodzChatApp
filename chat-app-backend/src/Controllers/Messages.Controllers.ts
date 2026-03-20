import { Request, Response } from "express";
import MessageServices from "../Services/MessageServices";

export default class MessagesControllers {
    private messageServices : MessageServices;
    constructor(messageServices: MessageServices) {
        this.messageServices = messageServices;
    }

    // ==================================================== Create or Send Message To The Receiver or Friend =============================================================================== //
    async sendMessage(req: Request, res: Response) : Promise<Response | null> {
        try {
            const sendMessage = req.body;

            const sendMessageResponse = await this.messageServices.sendMessage(
                sendMessage.senderId, 
                sendMessage.receiverId, 
                sendMessage, 
                sendMessage.mediaFile
            );

            if(!sendMessageResponse ) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to send message"
                });
            }

            return res.status(201).json({                success: true, 
                data: sendMessageResponse, 
                message: "Message Sent Successfully"
            });
        
        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }

    }

    async sendMultipleMessagesToAllFriends(req: Request, res: Response) : Promise<Response | null> {
        try {
            const sendMultipleMessagesToAllFriends = req.body;

            const sendMultipleMessagesToAllFriendsResponse = await this.messageServices.sendMultipleMessagesToAllFriends(
                sendMultipleMessagesToAllFriends.senderId, 
                sendMultipleMessagesToAllFriends.receiverIds, 
                sendMultipleMessagesToAllFriends.message, 
                sendMultipleMessagesToAllFriends.mediaFile);

            if(!sendMultipleMessagesToAllFriendsResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to send multiple messages to all friends"
                });
            }

            return res.status(201).json({
                success: true, data: 
                sendMultipleMessagesToAllFriendsResponse, 
                message: "Multiple Messages Sent Successfully"
            });

        } catch (error: any) {
            return res.status(500).json({success: false, message: error.message});
        }
    }

    async sendMessageToRoom(req: Request, res: Response) : Promise<Response | null> {
        try {
            const sendMessageToRoom = req.body;

            const sendMessageToRoomResponse = await this.messageServices.sendMessageToRoom(
                sendMessageToRoom.roomId, 
                sendMessageToRoom.senderId, 
                sendMessageToRoom.message, 
                sendMessageToRoom.mediaFile
            );

            if(!sendMessageToRoomResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to send message to the Room"
                });
            }

            return res.status(201).json({
                success: true, 
                data: sendMessageToRoomResponse, 
                message: "Message Sent to the Room Successfully"
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }

    // ================================================ Reply to Message have Send from Receiver ============================================================ //
    async replyToMessageFromReceiverToSender(req: Request, res: Response) : Promise<Response | null> {
        try {
            const replyToMessageFromReceiverToSender = req.body;

            const replyToMessageFromReceiverToSenderResponse = await this.messageServices.replyToMessageFromReceiverToSender(
                replyToMessageFromReceiverToSender.senderId, 
                replyToMessageFromReceiverToSender.receivedId, 
                replyToMessageFromReceiverToSender.message, 
                replyToMessageFromReceiverToSender.replyAt, 
                replyToMessageFromReceiverToSender.mediaFile
            );

            if(!replyToMessageFromReceiverToSenderResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to send reply to the Sender"
                });
            }

            return res.status(201).json({
                success: true, 
                data: replyToMessageFromReceiverToSenderResponse, 
                message: "Reply Message Sent Successfully" 
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }


    async replyToMessageFromRoomBySenderToReceivers(req: Request, res: Response) : Promise<Response | null> {
        try {
            const replyToMessageFromRoomBySenderToReceivers = req.body;

            const replyToMessageFromRoomBySenderToReceiversResponse = await this.messageServices.replyToMessageFromRoomBySenderToReceivers(
                replyToMessageFromRoomBySenderToReceivers.roomId, 
                replyToMessageFromRoomBySenderToReceivers.senderId, 
                replyToMessageFromRoomBySenderToReceivers.message, 
                replyToMessageFromRoomBySenderToReceivers.replyAt, 
                replyToMessageFromRoomBySenderToReceivers.mediaFile
            );

            if(!replyToMessageFromRoomBySenderToReceiversResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to send reply to the Room by the Sender"
                });
            }

            return res.status(201).json({
                success: true, 
                data: replyToMessageFromRoomBySenderToReceiversResponse, 
                message: "Reply Message Sent Successfully" 
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }


    // ==================================================== Read Message from sender to receiver =============================================================================== //
    async getMessageBySenderIdToReceiverId(req: Request, res: Response) : Promise<Response | null> {
        try {
            const getMessageBySenderIdToReceiverId = req.body;

            const getMessageBySenderIdToReceiverIdResponse = await this.messageServices.getMessageBySenderIdToReceiverId(
                getMessageBySenderIdToReceiverId.id, 
                getMessageBySenderIdToReceiverId.senderId, 
                getMessageBySenderIdToReceiverId.receiverId, 
                getMessageBySenderIdToReceiverId.readAt
            );

            if(!getMessageBySenderIdToReceiverIdResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to get message from the sender to the receiver"
                });
            }

            return res.status(201).json({
                success: true, 
                data: getMessageBySenderIdToReceiverId, 
                message: "Read Message From Sender Successfully"
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }

    async getMessageByReceiverId(req: Request, res: Response) : Promise<Response | null> {
        try {
            const getMessageByReceiverId = req.body;

            const getMessageByReceiverIdResponse = await this.messageServices.getMessagesByReceiverId(
                getMessageByReceiverId.senderId, 
                getMessageByReceiverId.receiverId, 
                getMessageByReceiverId.readAt, 
                getMessageByReceiverId.offset
            );

            if(!getMessageByReceiverIdResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to get message from the receiver"
                });
            }
            return res.status(201).json({
                success: true, 
                data: getMessageByReceiverIdResponse, 
                message: "Read Message From Receiver Successfully"
            });
 
        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        } 
    }

    async getMessagesByRoomIdOrGroupChat(req: Request, res: Response) : Promise<Response | null> {
        try {
            const getMessagesByRoomIdOrGroupChat = req.body;

            const getMessagesByRoomIdOrGroupChatResponse = await this.messageServices.getMessagesByRoomIdOrGroupChat(
                getMessagesByRoomIdOrGroupChat.roomId, 
                getMessagesByRoomIdOrGroupChat.senderId, 
                getMessagesByRoomIdOrGroupChat.receiverIds, 
                getMessagesByRoomIdOrGroupChat.readAt, 
                getMessagesByRoomIdOrGroupChat.offset
            );

            if(!getMessagesByRoomIdOrGroupChatResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to get Message from the Room or Group Chat"
                });
            }

            return res.status(201).json({
                success: true, 
                data: getMessagesByRoomIdOrGroupChatResponse, 
                message: "Read Message From Room or Group Chat Successfully"
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }

    // ===================================================== Delete or Remove Message from the Friends ================================================================ //
    async deleteOrRemoveMessageToUserOrFriendByMessageIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const messageId = parseInt(req.params.messageId);
            const deleteOrRemoveMessageToUserOrFriendByMessageId = req.body;

            const deleteOrRemoveMessageToUserOrFriendByMessageIdResponse = await this.messageServices.deleteOrRemoveMessageToUserOrFriendByMessageId(
                messageId, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.senderId, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.receiverId, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.message, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.isHardDelete, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.deletedAt, 
                deleteOrRemoveMessageToUserOrFriendByMessageId.mediaFile
            );

            if(!deleteOrRemoveMessageToUserOrFriendByMessageIdResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to delete or remove message"
                });
            }

            return res.status(200).json({ 
                success: true, 
                data: deleteOrRemoveMessageToUserOrFriendByMessageIdResponse, 
                message: "Message Deleted Successfully" 
            });

        } catch (error : any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }

    async deleteOrRemoveMessageByRoomIdController(req: Request, res: Response) : Promise<Response | null> {
        try {
            const roomId = parseInt(req.params.roomId);
            const deleteOrRemoveMessageByRoomId = req.body

            const deleteOrRemoveMessageByRoomIdResponse = await this.messageServices.deleteOrRemoveMessageByRoomId(
                roomId, 
                deleteOrRemoveMessageByRoomId.messageId, 
                deleteOrRemoveMessageByRoomId.senderId, 
                deleteOrRemoveMessageByRoomId.message, 
                deleteOrRemoveMessageByRoomId.isHardDelete, 
                deleteOrRemoveMessageByRoomId.deletedAt, 
                deleteOrRemoveMessageByRoomId.mediaFile
            );

            return res.status(201).json({
                 success: true,
                 data: deleteOrRemoveMessageByRoomIdResponse,
                 message: "Message Deleted Successfully"
                });

        } catch (error : any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }


    // ================================================================== Update Message Controller ==================================================== //
    async updateMessageByIdController(req:Request, res: Response) : Promise<Response | null> {
        try {

            const id = parseInt(req.params.id);
            const updateMessageById = req.body;

            const updateMessageByIdResponse = await this.messageServices.updateMessageById(
                updateMessageById.id,
                updateMessageById.senderId, 
                updateMessageById.readAt, 
                updateMessageById.receivedId, 
                updateMessageById.message, 
                updateMessageById.updatedAt);
            if(!updateMessageByIdResponse) {
                return res.status(400).json({
                    success: false, 
                    message: "Failed to update message."
                });
            }

            return res.status(201).json({
                success: true, 
                data: updateMessageByIdResponse, 
                message: "Message Updated Successfully"
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }


    async updateMessageByRoomId(req: Request, res: Response) : Promise<Response | null> {
        try {
            const roomId = parseInt(req.params.roomId);
            const id = parseInt(req.params.id);
            const updateMessageByRoomId = req.body;
            const updateMessageByRoomIdResponse = await this.messageServices.updateMessageByRoomId(
                id,
                roomId,
                updateMessageByRoomId.senderId, 
                updateMessageByRoomId.readAt, 
                updateMessageByRoomId.message, 
                );

            return res.status(201).json({
                success: true, 
                data: updateMessageByRoomIdResponse, 
                message: "Message Updated Successfully"
            });
            
        } catch (error: any) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    }



}