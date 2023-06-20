const { Schema, model } = require("mongoose"); // importo de mongoose

const collection = "users"; // defino el nombre de mi coleccion

// doy el formato de modelo de mis bojetos a poner en esa coleccion
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        //required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    },
});

userSchema.pre("findOne", function () {
    this.populate("cartId");
});

const UserModel = model(collection, userSchema); // creo el objeto de modelo

module.exports = {
    UserModel,
};
