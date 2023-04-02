const { ProductManager } = require("../productManager"); // Importo mi clase ProductManager.

const path = "../archivos/products.json"; // Genero mi path para pasarle a mi clase.
const manager = new ProductManager(path); // Genero mi ProductManager.

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Configuro mi servidor para que reciba  datos complejos por url.

app.get("/products", async (req, res) => {
    // Endpoint products (mostrar productos con posibilidad de definir limite).
    try {
        let { limit } = req.query; // Destructuracion de el query param para que no me pasan datos que no quiero.
        let data = await manager.getProducts(); // Obtengo mis productos.
        if (limit === undefined)
            return res.status(200).send({
                status: "success",
                data: data,
            }); // Verifico si se paso limite por parametro. Si no me paso devuelvo todos mis productos.
        if ((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) {
            return res.status(400).send({ status: "ERROR", error: "limit debe ser un numero positivo" }); // Verifico que no me pase letras o numeros negativos en el limite.
        }
        return res.status(200).send({
            status: "success",
            data: data.slice(0, limit > data.length ? data.length : limit), // si paso bien limite verifico si paso mas que mi cantidad de productos.
        }); // envio mi array de productos limitado.
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al obtener los productos",
        });
        return error;
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        if (!parseInt(pid) && parseInt(pid) !== 0)
            return res.status(400).send({
                status: "ERROR",
                error: "Product id debe ser un numero",
            }); // Verifico que pid sea un numero
        let producto = await manager.getProductById(parseInt(pid)); // busco el producto por el id pasado
        if (!producto) return res.status(404).send({ status: "ERROR", error: "Not found" }); // si no lo encuentro devuelvo un 404 con error not found
        return res.status(200).send({
            status: "success",
            data: producto,
        }); // si lo encuentro devuelvo el producto.
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: "Ha ocurrido un error al obtener el producto",
        });
        return error;
    }
});

app.listen(8080, () => {
    console.log("Escuchando puerto 8080");
});
