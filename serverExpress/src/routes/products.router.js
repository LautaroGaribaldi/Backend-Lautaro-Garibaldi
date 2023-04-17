const { Router } = require("express"); // Importo Router de express
const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.

const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
const manager = new ProductManager(path); // Genero mi ProductManager.

const router = Router();
// modularizo mis rutas en express.

// GET
router.get("/", async (req, res) => {
    // Endpoint products (mostrar productos con posibilidad de definir limite).
    try {
        let { limit } = req.query; // Destructuracion de el query param para que no me pasan datos que no quiero.
        let data = await manager.getProducts(); // Obtengo mis productos.
        if (limit === undefined)
            return res.status(200).send({
                status: "success",
                payload: data,
            }); // Verifico si se paso limite por parametro. Si no me paso devuelvo todos mis productos.
        if ((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) {
            return res.status(400).send({ status: "ERROR", error: "limit debe ser un numero positivo" }); // Verifico que no me pase letras o numeros negativos en el limite.
        }
        return res.status(200).send({
            status: "success",
            payload: data.slice(0, limit > data.length ? data.length : limit), // si paso bien limite verifico si paso mas que mi cantidad de productos.
        }); // envio mi array de productos limitado.
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al obtener los productos",
        });
        return error;
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        if (!parseInt(pid) && parseInt(pid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que pid sea un numero
        let product = await manager.getProductById(parseInt(pid)); // busco el producto por el id pasado
        if (!product) return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error not found
        return res.status(200).send({
            status: "success",
            payload: product,
        }); // si lo encuentro devuelvo el producto.
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al obtener el producto",
        });
        return error;
    }
});
// POST
router.post("/", async (req, res) => {
    // Endpoint products (mostrar productos con posibilidad de definir limite).
    try {
        let product = await req.body;
        let data = await manager.addProduct(product); // si todo es correcto agrego el producto.
        console.log(data);
        if (data.status === "error") {
            return res.status(404).send({
                data,
            });
        }
        res.status(200).send({
            status: "success",
            payload: product,
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al subir el productos",
        });
        return error;
    }
});

//PUT
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        if (!parseInt(pid) && parseInt(pid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que pid sea un numero
        let data = await manager.getProducts(); // Obtengo mis productos.
        let product = await manager.getProductById(parseInt(pid)); // busco el producto por el id pasado
        if (!product) return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error not found
        let productUpdated = req.body; //obtengo mi producto del body.
        let codProd = undefined;
        // Si modifico el code del producto verifico que no sea uno que ya use
        if (productUpdated.code !== product.code) {
            codProd = data.find((prod) => prod.code === productUpdated.code); // Verifico si mi code pasado ya fue utilizado
        }
        if (codProd) return res.status(405).send({ status: "ERROR", error: `Code repetido. Code ${productUpdated.code} ya fue utilizado.` }); // si el code es repetido mando el error.
        manager.updateProduct(parseInt(pid), productUpdated);
        res.status(200).send({
            status: "success",
            payload: productUpdated,
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al actualizar el producto",
        });
        return error;
    }
});

//DELETE
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        if (!parseInt(pid) && parseInt(pid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que pid sea un numero
        let product = await manager.getProductById(parseInt(pid)); // busco el producto por el id pasado
        if (!product) return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error not found
        manager.deleteProduct(parseInt(pid)); // si lo encuentro borro el producto.
        return res.status(200).send({
            status: "success",
            payload: product,
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al Borrar el producto",
        });
        return error;
    }
});
module.exports = router;
