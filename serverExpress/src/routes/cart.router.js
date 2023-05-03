const { Router } = require("express"); // Importo Router de express
//const { CartManager } = require("../managerDaos/cartManager"); // Importo mi clase CartManager.
//const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.
const cartManager = require("../managerDaos/mongo/cart.mongo");
const productManager = require("../managerDaos/mongo/product.mongo.js");

//const path = "./src/archivos/carts.json"; // Genero mi path para pasarle a mi clase.
//const manager = new CartManager(path); // Genero mi CartManager.

//const pathProducts = "./src/archivos/products.json";
//const managerProduct = new ProductManager(pathProducts);

const router = Router();
// modularizo mis rutas en express.

//POST

router.post("/", async (req, res) => {
    try {
        let result = await cartManager.addCart(); //Creo mi carrito

        // si dio error muestro el error
        if (!result || result.status === "error") {
            return res.status(404).send({
                status: "error",
                error: result,
            });
        }
        // si todo fue ok muestro el resultado
        res.status(200).send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al crear el carrito",
        });
        return error;
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartManager.getCartById(cid); // Verifico si el cid que paso existe
        if (!cart || cart.status === "error") {
            return res.status(404).send({
                status: "error",
                error: `No existe el carrito id ${cid}`,
            });
        }
        const product = await productManager.getProductById(pid); // Verifico si el pid que paso existe

        if (!product || product.status === "error") {
            return res.status(404).send({
                status: "error",
                error: `No existe el producto id ${pid}`,
            });
        }

        //console.log(cart.status);
        result = await cartManager.addProduct(cid, pid); // si todo es ok agrego el producto al carrito
        //console.log(result);
        res.status(200).send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al crear el carrito",
        });
        return error;
    }
});

//GET

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        let cart = await cartManager.getCartById(cid); // busco el carrito por el id pasado
        if (!cart || cart.status === "error") {
            return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
        } // si no lo encuentro devuelvo un 404 con error
        return res.status(200).send({
            status: "success",
            payload: cart,
        }); // si lo encuentro devuelvo el producto.
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al obtener el carrito",
        });
        return error;
    }
});

module.exports = router;
