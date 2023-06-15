const { Router } = require("express"); // Importo Router de express
const productManager = require("../managerDaos/mongo/product.mongo.js");
//const { authToken } = require("../utils/jwt.js");
const passport = require("passport");

const router = Router();

// GET
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // Endpoint products (mostrar productos con posibilidad de definir limite).
    try {
        let { limit } = req.query; // Destructuracion de el query param para que no me pasan datos que no quiero.
        let { page } = req.query;
        let { sort } = req.query;
        let sortType = {};

        if (page) {
            page = parseInt(page);
        }

        if (sort === "asc") {
            sortType = { price: 1 };
        } else if (sort === "desc") {
            sortType = { price: -1 };
        }

        let query = {}; // genero mi query por 2 req.query
        if (req.query.category) {
            query = { ...query, category: req.query.category };
        }
        if (req.query.availability) {
            query = { ...query, stock: { $gt: 0 } };
        }
        //console.log(query);
        let data = await productManager.getProducts(limit, page, query, sortType);

        if (((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) && limit !== undefined) {
            return res.status(400).send({ status: "ERROR", error: "limit debe ser un numero positivo" }); // Verifico que no me pase letras o numeros negativos en el limite.
        }

        //console.log(data);

        return res.status(200).send({
            ...data, //si paso bien el limite paso data
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
