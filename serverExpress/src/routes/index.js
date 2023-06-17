const { Router } = require("express");
//const productRouter = require("./oldProducts.router.js");
//const cartRouter = require("./oldCart.router.js");
//const viewsRouter = require("./oldViews.router.js");
//const userRouter = require("./oldUser.router.js");
const UserRouter = require("./user.router.js");
const ProductRouter = require("./products.router.js");
const CartRouter = require("./cart.router.js");
const ViewsRouter = require("./views.router.js");
const SessionsRouter = require("./session.router.js");
//const cookieRouter = require("./pruebas.router.js");
//const sessionRouter = require("./oldSession.router.js");
const { uploader } = require("../utils/multer");

const router = Router();
const usersRouter = new UserRouter();
const productsRouter = new ProductRouter();
const cartsRouter = new CartRouter();
const viewRouter = new ViewsRouter();
const sessionsRouter = new SessionsRouter();

//router.use("/", viewsRouter);
//router.use("/pruebas", cookieRouter);
//router.use("/api/session", sessionRouter);
//router.use("/api/products", productRouter);
//router.use("/api/carts", cartRouter);
//router.use("/api/users", userRouter);
router.use("/api/users", usersRouter.getRouter());
router.use("/api/products", productsRouter.getRouter());
router.use("/api/carts", cartsRouter.getRouter());
router.use("/", viewRouter.getRouter());
router.use("/api/session", sessionsRouter.getRouter());

router.post("/single", uploader.single("myfile"), async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "se subió correctamente",
    });
});

module.exports = router;
