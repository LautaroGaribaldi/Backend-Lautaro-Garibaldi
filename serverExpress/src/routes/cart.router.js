const RouterClass = require("./RouterClass.js");
//const cartManager = require("../managerDaos/mongo/cart.mongo.js");
//const productManager = require("../managerDaos/mongo/product.mongo.js");
//const { verifyCid, verifyPid } = require("../utils/cartValidator.js"); // funciones de validacion extraidas
const { createCart, addProduct, getCart, deleteProduct, emptyCart, updateProducts, updateProduct } = require("../controllers/carts.controller.js");

class CartsRouter extends RouterClass {
    init() {
        this.post("/", ["PUBLIC"], createCart);

        this.post("/:cid/product/:pid", ["PUBLIC"], addProduct);

        this.get("/:cid", ["PUBLIC"], getCart);

        this.delete("/:cid/product/:pid", ["PUBLIC"], deleteProduct);

        this.delete("/:cid", ["PUBLIC"], emptyCart);

        this.put("/:cid", ["PUBLIC"], updateProducts);

        this.put("/:cid/product/:pid", ["PUBLIC"], updateProduct);
    }
}

module.exports = CartsRouter;
