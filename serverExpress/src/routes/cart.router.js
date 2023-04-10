const { Router } = require("express"); // Importo Router de express
const { CartManager } = require("../managerDaos/cartManager"); // Importo mi clase CartManager.
const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.

const path = "./src/archivos/carts.json"; // Genero mi path para pasarle a mi clase.
const manager = new CartManager(path); // Genero mi CartManager.

const pathProducts = "./src/archivos/products.json";
const managerProduct = new ProductManager(pathProducts);

const router = Router();
// modularizo mis rutas en express.

//POST

router.post("/", async (req, res) => {
    try {
        let data = await manager.getCarts();
        let cartId = 0;
        if (data.length === 0) {
            // Verifico si hay algun carrito. Si no lo hay el primer id es 1 sino tomo el ultimo id y le sumo 1
            cartId = 1;
        } else {
            cartId = data[data.length - 1].id + 1;
        }
        manager.addCart({ id: cartId, products: [] });
        res.status(200).send({ status: "success", payload: { id: cartId, products: [] } });
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
        if (!parseInt(cid) && parseInt(cid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que cid sea un numero
        if (!parseInt(pid) && parseInt(pid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que pid sea un numero
        let cart = await manager.getCartById(parseInt(cid)); // busco el carrito por el id pasado
        if (!cart) return res.status(404).send({ status: "ERROR", error: "Id de carrito no encontrado, verifique cid." }); // si no lo encuentro devuelvo un 404 con error not found
        let product = await managerProduct.getProductById(parseInt(pid)); // busco el producto por el id pasado
        if (!product) return res.status(404).send({ status: "ERROR", error: "Producto inexistente, verifique pid." }); // si no lo encuentro devuelvo un 404 con error not found
        manager.addProduct(parseInt(cid), parseInt(pid)); // si todo es correcto agrego mi producto al carrito indicado.
        res.status(200).send({ status: "success", payload: `Se agrego el producto id ${pid} al carrito id ${cid}` });
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
        if (!parseInt(cid) && parseInt(cid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que cid sea un numero
        let cart = await manager.getCartById(parseInt(cid)); // busco el producto por el id pasado
        if (!cart) return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error not found
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
