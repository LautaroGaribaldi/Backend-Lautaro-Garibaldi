//const UserDaoMongo = require("../managerDaos/mongo/user.mongo.js");
const { userService } = require("../service/index.js");
const { createHash } = require("../utils/bcryptHash");
const { sendMail } = require("../utils/sendMail.js");
const { sendSms, sendWhatsapp } = require("../utils/sendSms.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

class UserController {
    //GET
    getUsers = async (req, res) => {
        try {
            let users = await userService.getUsers(); // busco todos mis users
            res.sendSuccess(users);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    sendEmail = async (req, res) => {
        try {
            let html = `<div>
            <h1>Prueba de envio de mail por servidor </h1>
            </div>`;
            let result = await sendMail("lautaro.garibaldi@gmail.com", "prueba abstraccion mail", html);
            res.sendSuccess("email Enviado");
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    sendSms = async (req, res) => {
        try {
            await sendSms();
            //await sendWhatsapp();
            res.sendSuccess("sms Enviado");
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    //POST
    createUsers = async (req, res) => {
        try {
            let user = req.body;
            // creo el nuevo objeto respetando el modelo de objetos pasados.
            const newUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                password: createHash(user.password),
            };
            let result = await userService.createUser(newUser); // lo creo en mi base de datos
            //res.status(200).send({ result }); // devuelvo el resultado.
            res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    //PUT
    updateUsers = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = req.body;

            let userToReplace = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                password: user.password ? createHash(user.password) : undefined,
            };

            let result = await userService.updateUser(uid, userToReplace);
            if (result.status === "error" || result.modifiedCount == 0) {
                req.logger.error("Email vacio o no es valido.");
                return res.sendServerError("Email vacio o no valido.");
            }

            /*res.status(200).send({
            status: "success",
            payload: result,
        });*/
            res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    updatePremium = async (req, res) => {
        try {
            const { uid } = req.params;
            let user = await userService.getUserById(uid);

            if (!user) {
                req.logger.warning("Usuario inexistente");
                return res.status(404).send({ status: "error", message: "Usuario inexistente" });
            }

            if (user.role === "user") {
                user.role = "premium";
                await user.save();
            } else if (user.role === "premium") {
                user.role = "user";
                await user.save();
            } else {
                return res.status(405).send({ status: "error", message: "El usuario seleccionado no es user ni premium" });
            }

            res.status(200).send({
                status: "success",
                payload: `Rol cambiado exitosamente a ${user.role}`,
            });
            //res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    //DELETE
    deleteUsers = async (req, res) => {
        try {
            const { uid } = req.params;

            let result = await userService.deleteUser(uid);

            res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };
}

module.exports = new UserController();
