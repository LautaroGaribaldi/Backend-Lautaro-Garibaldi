const { Schema, model } = require("mongoose");

const ContactCollection = "contacts";

const ContactSchema = Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    active: Boolean,
    phone: String,
});

let contactModel = model(ContactCollection, ContactSchema);

module.exports = {
    contactModel,
};
