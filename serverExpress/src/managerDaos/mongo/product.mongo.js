const { ProductModel } = require("./model/products.models");

//productModel;

class ProductDaoMongo {
    constructor() {
        this.productModel = ProductModel;
    }
    async getProducts(limit = 10, page = 1, query = {}, sort = { code: 1 }) {
        try {
            let products = await this.productModel.paginate(query, { limit: limit, page: page, sort, lean: true });
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = products;
            //Verificaciones para saber como armar los links
            if (!query.category) {
                query.category = "";
            } else {
                query.category = `&category=${query.category}`;
            }
            if (!query.stock) {
                query.stock = "";
            } else {
                query.stock = `&availability=true`;
            }
            if (!sort.price) {
                sort.price = "";
            } else if (sort.price == 1) {
                sort.price = `&sort=asc`;
            } else {
                sort.price = `&sort=desc`;
            }
            const prevLink = hasPrevPage
                ? `http://localhost:8080/api/products?page=${prevPage}&limit=${limit}${query.category}${query.stock}${sort.price}`
                : null;
            const nextLink = hasNextPage
                ? `http://localhost:8080/api/products?page=${nextPage}&limit=${limit}${query.category}${query.stock}${sort.price}`
                : null;

            return {
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async getProductById(pid) {
        try {
            return await this.productModel.findOne({ _id: pid });
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async getProductBy(params) {
        try {
            return await this.productModel.findOne(params);
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async createProduct(newProduct) {
        try {
            return await this.productModel.create(newProduct);
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async updateProduct(pid, productEdit) {
        try {
            return await this.productModel.updateOne({ _id: pid }, productEdit);
        } catch (error) {
            return { status: "error", error: error };
        }
    }
    async deleteProduct(pid) {
        try {
            return await this.productModel.deleteOne({ _id: pid });
        } catch (error) {
            return { status: "error", error: error };
        }
    }
}

module.exports = ProductDaoMongo;
