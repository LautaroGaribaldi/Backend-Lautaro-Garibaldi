const { Schema, model } = require("mongoose"); // importo de mongoose

const collection = "users"; // defino el nombre de mi coleccion

// doy el formato de modelo de mis bojetos a poner en esa coleccion
const userSchema = new Schema({
    firstName: String,
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const userModel = model(collection, userSchema); // creo el objeto de modelo

module.exports = {
    userModel,
};
