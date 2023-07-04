const { Schema, model } = require("mongoose");

const collection = "tickets";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    purchaseDateTime: { type: Date },
    amount: { type: Number },
    purchaser: { type: String },
});

const TicketModel = model(collection, ticketSchema);

module.exports = {
    TicketModel,
};
