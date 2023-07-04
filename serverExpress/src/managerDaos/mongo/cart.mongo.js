const { CartModel } = require("./model/carts.models.js");
const { TicketModel } = require("./model/ticket.model.js");

class CartDaoMongo {
    constructor() {
        this.cartModel = CartModel;
        this.ticketModel = TicketModel;
    }
    getCarts = async () => {
        try {
            return await this.cartModel.find();
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    getCartById = async (cid) => {
        try {
            return await this.cartModel.findOne({ _id: cid }).lean();
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    createCart = async () => {
        try {
            return await this.cartModel.create({});
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    addProduct = async (cid, pid) => {
        try {
            const cart = await this.cartModel.findOne({ _id: cid });
            const products = cart.product.find((producto) => producto.idProduct._id == pid); // Verifico si mi carrito ya tiene el producto que me paso.
            if (!products) {
                return await this.cartModel.updateOne({ _id: cid }, { $push: { product: { idProduct: pid, quantity: 1 } } });
            } else {
                return await this.cartModel.updateOne({ _id: cid, "product.idProduct": pid }, { $inc: { "product.$.quantity": 1 } });
            }
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    deleteProducts = async (cid) => {
        try {
            return await this.cartModel.findOneAndUpdate({ _id: cid }, { $set: { product: [] } }, { new: true });
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    deleteProduct = async (cid, pid) => {
        try {
            return await this.cartModel.findOneAndUpdate({ _id: cid }, { $pull: { product: { idProduct: pid } } }, { new: true });
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    updateProducts = async (cid, products) => {
        try {
            return await this.cartModel.findOneAndUpdate({ _id: cid }, { $set: { product: products } }, { new: true });
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    updateProduct = async (cid, pid, quantity) => {
        try {
            return await this.cartModel.findOneAndUpdate(
                { _id: cid, "product.idProduct": pid },
                { $set: { "product.$.quantity": parseInt(quantity) } },
                { new: true }
            );
        } catch (error) {
            return { status: "error", error: error };
        }
    };
    generateTicket = async (ticket) => {
        return await this.ticketModel.create(ticket);
    };
}

module.exports = CartDaoMongo;
