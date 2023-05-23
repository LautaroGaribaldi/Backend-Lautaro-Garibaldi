const { productModel } = require("./model/products.models");

//productModel;

class ProductManagerMongo {
    async getProducts(limit = 10, page = 1, query = {}, sort = {}) {
        try {
            let products = await productModel.paginate(query, { limit: limit, page: page, sort, lean: true });
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
