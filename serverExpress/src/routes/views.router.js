const RouterClass = require("./RouterClass.js");
const productManager = require("../managerDaos/mongo/product.mongo.js");
const cartManager = require("../managerDaos/mongo/cart.mongo.js");
const { loged } = require("../middlewares/loged.middleware.js");
const { notLoged } = require("../middlewares/notLoged.middleware.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
    home,
    products,
    carts,
    chat,
    realTimeProducts,
    login,
    recoveryPass,
    register,
    profile,
    recovery,
} = require("../controllers/views.controller.js");

class ViewsRouter extends RouterClass {
    init() {
        this.get("/", ["PUBLIC"], home);

        this.get("/products", ["PUBLIC"], products);

        this.get("/carts/:cid", ["ADMIN"], carts);

        this.get("/chat", ["USER"], chat);

        this.get("/realTimeProducts", ["ADMIN", "PREMIUM"], realTimeProducts);

        this.get("/login", ["PUBLIC"], loged, login);

        this.get("/recoveryPassword", ["PUBLIC"], loged, recoveryPass);

        this.get("/recovery/:token", ["PUBLIC"], loged, recovery);

        this.get("/register", ["PUBLIC"], loged, register);

        this.get("/profile", ["PUBLIC"], notLoged, profile);
    }
}

module.exports = ViewsRouter;
