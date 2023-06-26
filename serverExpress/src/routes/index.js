const { Router } = require("express");
const UserRouter = require("./user.router.js");
const ProductRouter = require("./products.router.js");
const CartRouter = require("./cart.router.js");
const ViewsRouter = require("./views.router.js");
const SessionsRouter = require("./session.router.js");
const ContactsRouter = require("./contacts.router.js");
const cookieRouter = require("./pruebas.router.js");
const { uploader } = require("../utils/multer");

const router = Router();
const usersRouter = new UserRouter();
const productsRouter = new ProductRouter();
const cartsRouter = new CartRouter();
const viewRouter = new ViewsRouter();
const sessionsRouter = new SessionsRouter();

router.use("/pruebas", cookieRouter);
router.use("/api/users", usersRouter.getRouter());
router.use("/api/products", productsRouter.getRouter());
router.use("/api/carts", cartsRouter.getRouter());
router.use("/", viewRouter.getRouter());
router.use("/api/session", sessionsRouter.getRouter());
router.use("/api/contacts", ContactsRouter);

router.post("/single", uploader.single("myfile"), async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "se subió correctamente",
    });
});

module.exports = router;
