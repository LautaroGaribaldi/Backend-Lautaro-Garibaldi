const { Router } = require("express"); // Importo Router de express
//const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.

//const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
//const manager = new ProductManager(path); // Genero mi ProductManager.
const productManager = require("../managerDaos/mongo/product.mongo.js");
const cartManager = require("../managerDaos/mongo/cart.mongo");
const router = Router();

router.get("/", async (req, res) => {
    try {
        const { payload } = await productManager.getProducts();
        console.log(payload);
        const object = {
            style: "index.css",
            title: "Productos",
            products: payload,
        };
        res.render("home", object);
    } catch (error) {}
});

// vista paginada de productos
router.get("/products", async (req, res) => {
    try {
        const { page } = req.query;
        const { payload, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productManager.getProducts(undefined, page);
        if (page && (page > totalPages || page <= 0 || !parseInt(page))) {
            return res.status(400).send({ status: "error", error: "Pagina inexistente" });
        }
        const object = {
            style: "index.css",
            title: "Productos",
            products: payload,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
        res.render("products", object);
    } catch (error) {}
});

// vista de carrito
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        const object = {
            style: "index.css",
            title: "Productos",
            products: cart.product,
            id: cart._id,
        };
        res.render("carts", object);
    } catch (error) {}
});

router.get("/chat", async (req, res) => {
    try {
        res.render("chat", { style: "index.css" });
    } catch (error) {}
});

router.get("/realTimeProducts", async (req, res) => {
    const { payload } = await productManager.getProducts(20);
    const object = {
        style: "index.css",
        title: "Productos en tiempo real",
        products: payload,
    };
    res.render("realTimeProducts", object);
});

router.get("/login", async (req, res) => {
    const object = {
        style: "index.css",
        title: "Login",
        //products: payload,
    };
    res.render("login", object);
});

router.get("/register", async (req, res) => {
    const object = {
        style: "index.css",
        title: "register",
        //products: payload,
    };
    res.render("registerForm", object);
});

module.exports = router;
