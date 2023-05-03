const { productModel } = require("./model/products.models");

//productModel;

class ProductManagerMongo {
    async getProducts(limit = 0) {
        try {
            return await productModel.find().limit(limit).lean();
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async getProductById(pid) {
        try {
            return await productModel.findOne({ _id: pid });
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async addProduct(newProduct) {
        try {
            return await productModel.create(newProduct);
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async updateProduct(pid, productEdit) {
        try {
            return await productModel.updateOne({ _id: pid }, productEdit);
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async deleteProduct(pid) {
        try {
            return await productModel.deleteOne({ _id: pid });
        } catch (error) {
            return { status: "error", error: error };
        }
    }
}

module.exports = new ProductManagerMongo();
