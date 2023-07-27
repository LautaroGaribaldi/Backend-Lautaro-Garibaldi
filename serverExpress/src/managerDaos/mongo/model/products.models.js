const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    owner: {
        type: String,
        required: true,
        default: "admin",
    },
});

//{"title" : "Computadora", "description" : "computadora pa", "thumbnail" : "", "price" : 20, "stock" : 10, "code" : "AAA001"}

productSchema.plugin(mongoosePaginate);

const ProductModel = model(collection, productSchema);

module.exports = {
    ProductModel,
};
