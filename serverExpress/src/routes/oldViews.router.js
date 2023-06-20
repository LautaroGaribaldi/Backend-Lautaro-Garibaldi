const { Router } = require("express"); // Importo Router de express
//const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.

//const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
//const manager = new ProductManager(path); // Genero mi ProductManager.
const productManager = require("../managerDaos/mongo/product.mongo.js");
const cartManager = require("../managerDaos/mongo/cart.mongo.js");
const { loged } = require("../middlewares/loged.middleware.js");
const { notLoged } = require("../middlewares/notLoged.middleware.js");
//const { auth } = require("../middlewares/authentication.middleware.js");
const passport = require("passport");
const { passportCall } = require("../passportJwt/passportCall.js.js");
const { authorization } = require("../passportJwt/authorizationJwtRole.js");
const router = Router();

router.get("/", notLoged, passportCall("jwt"), async (req, res) => {
    try {
        const { payload } = await productManager.getProducts(15);
        //console.log(payload);
        const object = {
            style: "index.css",
            title: "Productos",
            user: req.user,
            products: payload,
        };
        res.render("home", object);
    } catch (error) {}
});

// vista paginada de productos
router.get(
    "/products",
    /*passportCall("jwt"),*/ async (req, res) => {
        try {
            const { page } = req.query;
            let loged = false;
            //console.log(req.user);
            const { payload, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productManager.getProducts(undefined, page);
            if (page && (page > totalPages || page <= 0 || !parseInt(page))) {
                return res.status(400).send({ status: "error", error: "Pagina inexistente" });
            }
            if (req.cookies.coderCookieToken) {
                loged = true;
            }
            //const role = req.user?.role === "admin" ? true : false;
            const object = {
                style: "index.css",
                title: "Productos",
                products: payload,
                //user: req.user,
                //role: role,
                loged,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            };
            res.render("products", object);
        } catch (error) {}
    }
);

// vista de carrito
router.get("/carts/:cid", notLoged, passportCall("jwt"), authorization("admin"), async (req, res) => {
    try {
        const { cid } = req.params;
        const role = req.user?.role === "admin" ? true : false;
        const cart = await cartManager.getCartById(cid);
        const object = {
            style: "index.css",
            title: "Productos",
            user: req.user,
            role: role,
            products: cart.product,
            id: cart._id,
        };
        res.render("carts", object);
    } catch (error) {}
});

router.get("/chat", notLoged, passportCall("jwt"), async (req, res) => {
    try {
        const role = req.user?.role === "admin" ? true : false;
        res.render("chat", { style: "index.css", user: req.user, role: role });
    } catch (error) {}
});

router.get("/realTimeProducts", notLoged, passportCall("jwt"), authorization("admin"), async (req, res) => {
    const { payload } = await productManager.getProducts(20);
    const object = {
        style: "index.css",
        title: "Productos en tiempo real",
        user: req.user,
        products: payload,
    };
    res.render("realTimeProducts", object);
});

//Formulario de login
router.get("/login", loged, async (req, res) => {
    const object = {
        style: "index.css",
        title: "Login",
        //products: payload,
    };
    res.render("login", object);
});

/*router.get("/login2", loged, async (req, res) => {
    const object = {
        style: "index.css",
        title: "Login",
        //products: payload,
    };
    res.render("login2", object);
});*/

router.get("/recoveryPassword", loged, async (req, res) => {
    const object = {
        style: "index.css",
        title: "Recovery Password",
        //products: payload,
    };
    res.render("recoveryPassword", object);
});

//Formulario de register
router.get("/register", loged, async (req, res) => {
    const object = {
        style: "index.css",
        title: "register",
        user: req.user,
    };
    res.render("registerForm", object);
});

//Perfil
router.get("/profile", notLoged, passportCall("jwt"), async (req, res) => {
    let loged = false;
    if (req.cookies.coderCookieToken) {
        loged = true;
    }
    const object = {
        style: "index.css",
        title: "Login",
        user: req.user,
        loged,
    };
    res.render("profile", object);
});

module.exports = router;
