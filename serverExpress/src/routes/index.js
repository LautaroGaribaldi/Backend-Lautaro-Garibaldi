const { Router } = require("express");
const productRouter = require("./products.router.js");
const cartRouter = require("./cart.router.js");
const viewsRouter = require("./views.router.js");
const userRouter = require("./user.router.js");
const { uploader } = require("../utils/multer");

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/api/users", userRouter);

router.post("/single", uploader.single("myfile"), async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "se subió correctamente",
    });
});

module.exports = router;
