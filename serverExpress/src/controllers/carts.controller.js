//const cartManager = require("../managerDaos/mongo/cart.mongo.js");
//const productManager = require("../managerDaos/mongo/product.mongo.js");
const { cartService, productService } = require("../service/index.js");
const { verifyCid, verifyPid } = require("../utils/cartValidator.js");
const jwt = require("jsonwebtoken");
const { codeGenerator } = require("../utils/codeGenerator.js");
require("dotenv").config();

class cartController {
    createCart = async (req, res) => {
        try {
            let result = await cartService.createCart(); //Creo mi carrito

            // si dio error muestro el error
            if (!result || result.status === "error") {
                req.logger.error("Error al crear el carrito");
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
            req.logger.fatal({ message: error });
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
            const { quantity } = req.body;
            const token = req.cookies.coderCookieToken;
            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                req.logger.warning(`No existe el producto id ${pid}`);
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }

            let product = await productService.getProduct(pid);

            if (product.stock <= 0)
                return res.status(404).send({
                    status: "error",
                    error: `el producto id ${pid} no tiene stock suficiente.`,
                });

            if (user.user.role === "premium") {
                if (user.user.email === product.owner) {
                    req.logger.warning(`El producto ${pid} pertenece a sus productos. no puede agregar sus propios productos!`);
                    return res.status(404).send({
                        status: "error",
                        error: `el producto id ${pid} pertenece al usuario.`,
                    });
                }
            }

            let result = await cartService.addProduct(cid, pid, quantity); // si todo es ok agrego el producto al carrito
            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            req.logger.fatal({ message: error });
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
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            let cart = await cartService.getCartById(cid); // busco el carrito por el id pasado
            return res.status(200).send({
                status: "success",
                payload: cart,
            }); // si lo encuentro devuelvo el producto.
        } catch (error) {
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al obtener el carrito",
            });
            return error;
        }
    };

    getCarts = async (req, res) => {
        try {
            let carts = await cartService.getCarts(); // busco el carrito por el id pasado
            return res.status(200).send({
                status: "success",
                payload: carts,
            }); // si lo encuentro devuelvo el producto.
        } catch (error) {
            req.logger.fatal({ message: error });
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
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }
            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                req.logger.warning(`No existe el producto id ${pid}`);
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }
            const cart = await cartService.getCartById(cid);
            const products = cart.product.find((producto) => producto.idProduct._id == pid);
            if (!products) {
                req.logger.warning(`No existe el producto id ${pid} en el carrito ${cid}`);
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
            req.logger.fatal({ message: error });
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
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const result = await cartService.deleteProducts(cid);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            req.logger.fatal({ message: error });
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
            const token = req.cookies.coderCookieToken;
            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            //Verifico que todos los productos pasados en el array sean validos
            //formato (array de objetos[{idProduct,quantity}])
            for (const product of products) {
                const validPid = await productService.getProduct(product.idProduct);
                if (!validPid || validPid.status === "error") {
                    req.logger.warning(`No existe el producto id ${product.idProduct}`);
                    return res.status(404).send({ status: "error", error: `No existe el producto id ${product.idProduct}` });
                }

                if (user.user.role === "premium") {
                    if (user.user.email === validPid.owner) {
                        req.logger.warning(`El producto ${product.idProduct} pertenece a sus productos. no puede agregar sus propios productos!`);
                        return res.status(403).send({
                            status: "error",
                            error: `el producto id ${product.idProduct} pertenece al usuario.`,
                        });
                    }
                }
            }

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const result = await cartService.updateProducts(cid, products);

            res.status(200).send({
                status: "success",
                payload: result,
            });
        } catch (error) {
            req.logger.fatal({ message: error });
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
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            const isPidValid = await verifyPid(pid); // Verifica si el pid que pasaste existe
            if (!isPidValid) {
                req.logger.warning(`No existe el producto id ${pid}`);
                return res.status(404).send({
                    status: "error",
                    error: `No existe el producto id ${pid}`,
                });
            }
            const cart = await cartService.getCartById(cid); // Verifico si el cid que paso existe
            const products = cart.product.find((producto) => producto.idProduct._id == pid);
            if (!products) {
                req.logger.warning(`No existe el producto id ${pid} en el carrito ${cid}`);
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
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al borrar  el producto",
            });
        }
    };

    purchase = async (req, res) => {
        try {
            const { cid } = req.params;
            const token = req.cookies.coderCookieToken;
            let tokenUser = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            const isValidCid = await verifyCid(cid);
            if (!isValidCid) {
                req.logger.warning(`No existe el carrito id ${cid}`);
                return res.status(404).send({ status: "error", error: `No existe el carrito id ${cid}` });
            }

            let cart = await cartService.getCartById(cid);
            let productsUnavailable = []; //Aux para ingresar productos sin stock

            if (cart.product.length == 0) {
                req.logger.error(`No hay productos el carrito id ${cid}`);
                return res.status(405).send({ status: "error", error: `No hay productos el carrito id ${cid}` }); // Verifico que el carrito no este vacio.
            }
            // Verifico si tengo stock necesario para cubrir la venta. luego si es asi hago el descuento de stock sino paso los productos a el aux de no disponibles
            for (const product of cart.product) {
                let stock = product.idProduct.stock;
                let pid = product.idProduct._id;
                if (stock >= product.quantity) {
                    product.idProduct.stock -= product.quantity;
                    await productService.updateProduct(pid, product.idProduct);
                } else {
                    productsUnavailable.push(product);
                }
            }
            // Filtro mi carrito los productos que puse en el array aux de no disponibles.
            const ProductsAvailable = cart.product.filter(
                (product) => !productsUnavailable.some((productUnavailable) => productUnavailable.idProduct._id === product.idProduct._id)
            );

            if (ProductsAvailable.length > 0) {
                //Generacion de ticket
                const ticket = {
                    code: codeGenerator(),
                    purchaseDateTime: new Date(),
                    amount: ProductsAvailable.reduce((total, product) => total + product.quantity * product.idProduct.price, 0),
                    purchaser: tokenUser.user.email,
                };
                const createdTicket = await cartService.generateTicket(ticket);
                await cartService.updateProducts(cid, productsUnavailable);

                if (productsUnavailable.length > 0) {
                    return res.status(202).send({
                        status: "success",
                        message: "Compra exitosa. algunos producto no tienen stock. revisar carrito!",
                        ticket: createdTicket,
                        productsUnavailable,
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        message: "Compra exitosa.",
                        ticket: createdTicket,
                    });
                }
            } else {
                req.logger.error(`Productos sin stock`);
                return res.status(404).send({ status: "error", error: `Productos sin stock`, productsUnavailable });
            }
        } catch (error) {
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al realizar la compra",
            });
        }
    };
}

module.exports = new cartController();
