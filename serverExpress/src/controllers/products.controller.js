//const productManager = require("../managerDaos/mongo/product.mongo.js");
const { productService, userService } = require("../service/index.js");
const { CustomError } = require("../utils/CustomError/CustomError.js");
const { Errors } = require("../utils/CustomError/EErrors.js");
const { generateProductErrorInfo } = require("../utils/CustomError/info.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail.js");

class ProductControler {
    getProducts = async (req, res) => {
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
            let data = await productService.getProducts(limit, page, query, sortType);

            if (((!parseInt(limit) && parseInt(limit) !== 0) || parseInt(limit) < 0) && limit !== undefined) {
                req.logger.warning("limit debe ser un numero positivo");
                return res.status(400).send({ status: "ERROR", error: "limit debe ser un numero positivo" }); // Verifico que no me pase letras o numeros negativos en el limite.
            }

            return res.status(200).send({
                ...data, //si paso bien el limite paso data
            });
        } catch (error) {
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al obtener los productos",
            });
            return error;
        }
    };

    getProduct = async (req, res) => {
        try {
            const { pid } = req.params;

            let data = await productService.getProduct(pid);
            if (!data || data.status === "error") {
                req.logger.error("Error al obtener el producto");
                return res.status(404).send({ status: "ERROR", error: "Not found" });
            } // si no lo encuentro devuelvo un 404 con error
            return res.sendSuccess(data);
            /*return res.status(200).send({
                status: "success",
                payload: data,
            });*/ // si lo encuentro devuelvo el producto.*/
        } catch (error) {
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al obtener el producto",
            });
            return error;
        }
    };

    createProduct = async (req, res, next) => {
        try {
            let product = await req.body;
            const token = req.cookies?.coderCookieToken;

            //Manejo de errores personalizado
            if (!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock) {
                req.logger.warning("Algun campo del producto esta vacio.");
                CustomError.createError({
                    name: "Product Creation Error",
                    cause: generateProductErrorInfo(product),
                    message: "Error trying to created product",
                    code: Errors.INVALID_TYPE_ERROR,
                });
            }
            let user;
            if (token) {
                user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
                if (user.user.role === "premium") {
                    product.owner = user.user.email;
                }
            }
            let data = await productService.createProduct(product);
            if (data.status === "error") {
                return res.status(404).send({
                    status: "error",
                    error: data,
                });
            }
            res.status(200).send({
                status: "success",
                payload: data,
            });
        } catch (error) {
            req.logger.fatal({ message: error });
            next(error);
            /*res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al subir el productos",
            });
            return error;*/
        }
    };

    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const token = req.cookies.coderCookieToken;
            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            let productUpdated = req.body;
            let product = await productService.getProduct(pid);
            if (user.user.role !== "admin") {
                if (user.user.email !== product.owner) {
                    req.logger.warning(`El producto ${pid} no pertenece a sus productos. Solo puede modificar sus propios productos!`);
                    return res.status(404).send({
                        status: "error",
                        error: `el producto id ${pid} no pertenece al usuario.`,
                    });
                }
            }

            let data = await productService.updateProduct(pid, productUpdated);

            if (data.matchedCount === 0 || data.status === "error") {
                req.logger.warning(`No se encontro el producto id ${pid}`);
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
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al actualizar el producto",
            });
            return error;
        }
    };

    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const token = req.cookies.coderCookieToken;
            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            let product = await productService.getProduct(pid);
            if (user.user.role !== "admin") {
                if (user.user.email !== product.owner) {
                    req.logger.warning(`El producto ${pid} no pertenece a sus productos. Solo puede borrar sus propios productos!`);
                    return res.status(404).send({
                        status: "error",
                        error: `el producto id ${pid} no pertenece al usuario.`,
                    });
                }
            }

            if (product.owner !== "admin") {
                let html = `<div>
                <h1>Se ah borrado su producto "${product.title}" por inactividad </h1>
                </div>`;
                let email = await sendMail(product.owner, "Se ah eliminado un producto suyo", html);
            }

            let result = await productService.deleteProduct(pid);

            if (result.deletedCount === 0 || result.status === "error") {
                req.logger.warning(`No existe el producto id ${pid}`);
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
            req.logger.fatal({ message: error });
            res.status(500).send({
                status: "ERROR",
                error: "Ha ocurrido un error al Borrar el producto",
            });
            return error;
        }
    };
}

module.exports = new ProductControler();
