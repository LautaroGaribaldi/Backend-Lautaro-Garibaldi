const RouterClass = require("./RouterClass.js");
//const cartManager = require("../managerDaos/mongo/cart.mongo.js");
//const productManager = require("../managerDaos/mongo/product.mongo.js");
//const { verifyCid, verifyPid } = require("../utils/cartValidator.js"); // funciones de validacion extraidas
const {
    createCart,
    addProduct,
    getCart,
    deleteProduct,
    emptyCart,
    updateProducts,
    updateProduct,
    purchase,
} = require("../controllers/carts.controller.js");

class CartsRouter extends RouterClass {
    init() {
        this.post("/", ["PUBLIC"], createCart);

        this.post("/:cid/product/:pid", ["USER"], addProduct);

        this.post("/:cid/purchase/", ["USER"], purchase);

        this.get("/:cid", ["USER"], getCart);

        this.delete("/:cid/product/:pid", ["USER"], deleteProduct);

        this.delete("/:cid", ["USER"], emptyCart);

        this.put("/:cid", ["USER"], updateProducts);

        this.put("/:cid/product/:pid", ["USER"], updateProduct);
    }
}

module.exports = CartsRouter;
