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
    getCarts,
} = require("../controllers/carts.controller.js");

class CartsRouter extends RouterClass {
    init() {
        this.post("/", ["PUBLIC"], createCart);

        this.post("/:cid/product/:pid", ["USER", "PREMIUM", "ADMIN"], addProduct);

        this.get("/:cid/purchase/", ["USER", "PREMIUM", "ADMIN"], purchase);

        this.get("/:cid", ["USER", "ADMIN", "PREMIUM"], getCart);

        this.get("/", ["ADMIN", "PREMIUM"], getCarts);

        this.delete("/:cid/product/:pid", ["USER", "PREMIUM", "ADMIN"], deleteProduct);

        this.delete("/:cid", ["USER", "PREMIUM", "ADMIN"], emptyCart);

        this.put("/:cid", ["USER", "PREMIUM", "ADMIN"], updateProducts);

        this.put("/:cid/product/:pid", ["USER", "PREMIUM", "ADMIN"], updateProduct);
    }
}

module.exports = CartsRouter;
