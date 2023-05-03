const { Router } = require("express"); // Importo Router de express
//const { ProductManager } = require("../managerDaos/productManager"); // Importo mi clase ProductManager.
//mongo db
const productManager = require("../managerDaos/mongo/product.mongo.js");

//const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
//const manager = new ProductManager(path); // Genero mi ProductManager.

const router = Router();
// modularizo mis rutas en express.

// GET
router.get("/", async (req, res) => {
    // Endpoint products (mostrar productos con posibilidad de definir limite).
    try {
        let { limit } = req.query; // Destructuracion de el query param para que no me pasan datos que no quiero.
        let data = await productManager.getProducts(limit);

        if (limit === undefined)
            return res.status(200).send({
                status: "success",
                payload: data,
            }); // Verifico si se paso limite por parametro. Si no me paso devuelvo todos mis productos.

        if ((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) {
            return res.status(400).send({ status: "ERROR", error: "limit debe ser un numero positivo" }); // Verifico que no me pase letras o numeros negativos en el limite.
        }

        //console.log(data);

        return res.status(200).send({
            status: "success",
            payload: data, //si paso bien el limite paso data limitado
        });
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

        let data = await productManager.getProductById(pid);
        if (!data || data.status === "error") return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error
        return res.status(200).send({
            status: "success",
            payload: data,
        }); // si lo encuentro devuelvo el producto.*/
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
    try {
        let product = await req.body;
        let data = await productManager.addProduct(product);
        //console.log(data);
        if (data.status === "error") {
            return res.status(404).send({
                status: "error",
                error: data,
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

        let productUpdated = req.body;

        let data = await productManager.updateProduct(pid, productUpdated);

        if (data.matchedCount === 0 || data.status === "error") {
            return res.status(404).send({
                status: "error",
                error: `No existe el producto id ${pid}`,
            });
        }

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

        let result = await productManager.deleteProduct(pid);

        if (result.deletedCount === 0 || result.status === "error") {
            return res.status(404).send({
                status: "error",
                error: `No existe el producto id ${pid}`,
            });
        }

        return res.status(200).send({
            status: "success",
            payload: result,
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
