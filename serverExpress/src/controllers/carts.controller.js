//const cartManager = require("../managerDaos/mongo/cart.mongo.js");
//const productManager = require("../managerDaos/mongo/product.mongo.js");
const { cartService, productService } = require("../service/index.js");
const { verifyCid, verifyPid } = require("../utils/cartValidator.js");

class cartController {
    createCart = async (req, res) => {
        try {
            let result = await cartService.createCart(); //Creo mi carrito

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
    };

    addProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }

            let result = await cartService.addProduct(cid, pid); // si todo es ok agrego el producto al carrito
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
    };

    getCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            let cart = await cartService.getCartById(cid); // busco el carrito por el id pasado
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
    };

    deleteProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }
            const cart = await cartService.getCartById(cid);
            const products = cart.product.find((producto) => producto.idProduct._id == pid);
            if (!products) {
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid} en el carrito ${cid}`,
                });
            }
            const result = await cartService.deleteProduct(cid, pid);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al borrar  el producto",
            });
        }
    };

    emptyCart = async (req, res) => {
        try {
            const { cid } = req.params;

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const result = await cartService.deleteProducts(cid);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al borrar  el producto",
            });
        }
    };

    updateProducts = async (req, res) => {
        try {
            const { cid } = req.params;
            const products = req.body;

            //Verifico que todos los productos pasados en el array sean validos
            //formato (array de objetos[{idProduct,quantity}])
            products.forEach(async (product) => {
                const validPid = await productService.getProduct(product.idProduct);
                if (!validPid || validPid.status === "error") {
                    return res.status(404).send({ status: "error", error: `No existe el producto id ${product.idProduct}` });
                }
            });

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const result = await cartService.updateProducts(cid, products);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al borrar  el producto",
            });
        }
    };

    updateProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }
            const cart = await cartService.getCartById(cid); // Verifico si el cid que paso existe
            const products = cart.product.find((producto) => producto.idProduct._id == pid);
            if (!products) {
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid} en el carrito ${cid}`,
                });
            }
            const result = await cartService.updateProduct(cid, pid, quantity);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al borrar  el producto",
            });
        }
    };
}

module.exports = new cartController();
