const { Router } = require("express"); // Importo Router de express
const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.

const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
const manager = new ProductManager(path); // Genero mi ProductManager.

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts();
        const object = {
            style: "index.css",
            title: "Productos",
            products,
        };
        res.render("home", object);
    } catch (error) {}
});

router.get("/chat", async (req, res) => {
    try {
        //const products = await manager.getProducts();
        /*const object = {
            style: "index.css",
            title: "Productos",
            products,
        };*/
        res.render("chat", {});
    } catch (error) {}
});

router.get("/realTimeProducts", async (req, res) => {
    const products = await manager.getProducts();
    const object = {
        style: "index.css",
        title: "Productos en tiempo real",
        products,
    };
    res.render("realTimeProducts", object);
});

module.exports = router;
