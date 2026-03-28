import { ChatRoomsCreation } from "../Interfaces/ChatRoomsInterfaces";

export default class ChatRoomHelper {
    public static validateCreateChatRoom(chatRoom: ChatRoomsCreation): string | null {
        try {
            if (!chatRoom.name) {
                return "Name is required";
            }
            if (!chatRoom.description) {
                return "Description is required";
            }
            return null;
        } catch (error) {
            console.error("An unexpected error occurred during chat room validation:", error);
            return "An unexpected error occurred during validation.";
        }
    }
}
