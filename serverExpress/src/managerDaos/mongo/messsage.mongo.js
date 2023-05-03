const { messageModel } = require("./model/chat.models.js");

class MessagesManagerMongo {
    getMessages = async () => {
        try {
            return messageModel.find();
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    addMessage = async (newMessage) => {
        try {
            return messageModel.create(newMessage);
        } catch (error) {
            return { status: "error", error: error };
        }
    };
}

module.exports = new MessagesManagerMongo();
