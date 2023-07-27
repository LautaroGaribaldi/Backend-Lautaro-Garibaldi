const RouterClass = require("./RouterClass.js");
//const productManager = require("../managerDaos/mongo/product.mongo.js");
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/products.controller.js");

class ProductsRouter extends RouterClass {
    init() {
        this.get("/", ["PUBLIC"], getProducts);

        this.get("/:pid", ["PUBLIC"], getProduct);

        this.post("/", ["ADMIN", "PREMIUM", "ADMIN"], createProduct);

        this.put("/:pid", ["ADMIN", "PREMIUM", "ADMIN"], updateProduct);

        this.delete("/:pid", ["ADMIN", "PREMIUM", "ADMIN"], deleteProduct);
    }
}

module.exports = ProductsRouter;
