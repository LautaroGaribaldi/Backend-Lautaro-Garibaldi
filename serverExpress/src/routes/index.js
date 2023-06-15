const { Router } = require("express");
const productRouter = require("./products.router.js");
const cartRouter = require("./cart.router.js");
const viewsRouter = require("./views.router.js");
const userRouter = require("./user.router.js");
const UserRouter = require("./newUser.router.js");
const cookieRouter = require("./pruebas.router.js");
const sessionRouter = require("./session.router.js");
const { uploader } = require("../utils/multer");

const router = Router();
const usersRouter = new UserRouter();

router.use("/", viewsRouter);
router.use("/pruebas", cookieRouter);
router.use("/api/session", sessionRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/api/users", userRouter);
router.use("/api/newuser", usersRouter.getRouter());

router.post("/single", uploader.single("myfile"), async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "se subió correctamente",
    });
});

module.exports = router;
