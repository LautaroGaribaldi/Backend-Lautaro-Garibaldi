const { Schema, model } = require("mongoose");

const collection = "products";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: Array,
    code: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});

//{"title" : "Computadora", "description" : "computadora pa", "thumbnail" : "", "price" : 20, "stock" : 10, "code" : "AAA001"}

const productModel = model(collection, productSchema);

module.exports = {
    productModel,
};
