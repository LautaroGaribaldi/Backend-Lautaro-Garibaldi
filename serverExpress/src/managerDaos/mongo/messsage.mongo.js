const { MessageModel } = require("./model/chat.models.js");

class MessagesDaoMongo {
    constructor() {
        this.messageModel = MessageModel;
    }
    getMessages = async () => {
        try {
            return this.messageModel.find();
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    addMessage = async (newMessage) => {
        try {
            return this.messageModel.create(newMessage);
        } catch (error) {
            return { status: "error", error: error };
        }
    };
}

module.exports = MessagesDaoMongo;
