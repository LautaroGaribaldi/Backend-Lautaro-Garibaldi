const { Schema, model } = require("mongoose");

const collection = "carts";

const cartSchema = new Schema({
    product: [
        {
            idProduct: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

cartSchema.pre("findOne", function () {
    this.populate("product.idProduct");
});

const CartModel = model(collection, cartSchema);

module.exports = {
    CartModel,
};
