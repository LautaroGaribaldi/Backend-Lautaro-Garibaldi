const { Schema, model } = require("mongoose");

const collection = "messages";

const messagesSchema = new Schema({
    user: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },
});

const MessageModel = model(collection, messagesSchema);

module.exports = {
    MessageModel,
};
