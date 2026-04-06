import {Router} from "express";
import MessagesControllers from "../src/Controllers/Messages.Controllers";
import MessagesRepository from "../src/Repositories/MessageRepository";
import MessageServices from "../src/Services/MessageServices";
import MessageAutoMapper from "../src/AutoMapper/MessagesAutoMapper";

const router = Router()

const messageServices = new MessageServices(new MessagesRepository(), new MessageAutoMapper());

const messageController = new MessagesControllers(messageServices);

// ====================================  Router End Points For Send Message  ==================================== //
router.post("/send-message", messageController.sendMessage.bind(messageController));
router.post("send-message/all-friends/${senderId}${receiverIds}", messageController.sendMultipleMessagesToAllFriends.bind(messageController));
router.post("send-message/to-room/${roomId", messageController.sendMessageToRoom.bind(messageController));


// ======================================== Reply to Message have Send From Receiver and Send Back to the Sender End Points ================================================ //
router.post("reply-message/from-receiver-to-sender/${roomId}${senderId}${receiverId", messageController.replyToMessageFromReceiverToSender.bind(messageController));
router.post("reply-message/from-room-by-sender-to-receivers/${roomId}${senderId}${receiverIds}", messageController.replyToMessageFromRoomBySenderToReceivers.bind(messageController));

// ======================================== Get or Read Message End Points ================================================ //
router.get("get-message/by-sender-to-receiver/${senderId}${receiverId}", messageController.getMessageBySenderIdToReceiverId.bind(messageController));
router.get("get-message/by-sender-to-receiver/${senderId}${receiverId}", messageController.getMessageBySenderIdToReceiverId.bind(messageController));
router.get("get-message/by-room/${roomId}${senderId}${receiverIds}", messageController.getMessagesByRoomIdOrGroupChat.bind(messageController));

// ======================================= Delete Message End Points ================================================ //
router.delete("delete-message/by-user-or-friend/${messageId}${senderId}${receiverId}", messageController.deleteOrRemoveMessageToUserOrFriendByMessageIdController.bind(messageController));
router.delete("delete-message/by-room/${roomId}${messageId}${senderId}", messageController.deleteOrRemoveMessageByRoomIdController.bind(messageController));

// ====================================== Update Message End Points ======================================================== //
router.put("update-message/${id}${senderId}", messageController.updateMessageByIdController.bind(messageController));
router.put("update-message/by-room/${roomId}${id}${senderId}", messageController.updateMessageByRoomId.bind(messageController));

export default router; 

