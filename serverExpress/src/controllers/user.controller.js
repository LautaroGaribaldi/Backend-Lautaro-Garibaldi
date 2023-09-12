//const UserDaoMongo = require("../managerDaos/mongo/user.mongo.js");
const { UserModel } = require("../managerDaos/mongo/model/user.model.js");
const { userService } = require("../service/index.js");
const { createHash } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/jwt.js");
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
            let uploadIdentification = user.documents.some((document) => document.name.includes("identification"));
            let uploadComprobant = user.documents.some((document) => document.name.includes("comprobant"));
            let uploadAccountStatus = user.documents.some((document) => document.name.includes("accountStatus"));

            const token = req.cookies.coderCookieToken;
            let tokenUser = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

            if (!user) {
                req.logger.warning("Usuario inexistente");
                return res.status(404).send({ status: "error", message: "Usuario inexistente" });
            }

            if ((!uploadIdentification || !uploadComprobant || !uploadAccountStatus) && user.role === "user") {
                req.logger.warning("Faltan subir archivos para poder realizar esta accion");
                return res.status(404).send({ status: "error", message: "Faltan subir archivos para poder realizar esta accion" });
            }

            if (user.role === "user") {
                user.role = "premium";
                tokenUser.user.role = "premium";
                await user.save();
            } else if (user.role === "premium") {
                user.role = "user";
                tokenUser.user.role = "user";
                await user.save();
            } else {
                return res.status(405).send({ status: "error", message: "El usuario seleccionado no es user ni premium" });
            }

            //let accessToken = generateToken(tokenUser.user);

            res /*.cookie("coderCookieToken", accessToken, {
                maxAge: 86400000,
                httpOnly: true,
            })
                */.status(200)
                .send({
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
    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;

            let result = await userService.deleteUser(uid);

            res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params;
            const token = req.cookies.coderCookieToken;
            let tokenUser = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            let user = await userService.getUserById(uid);

            if (!user) {
                req.logger.warning("Usuario inexistente");
                return res.status(404).send({ status: "error", message: "Usuario inexistente" });
            }

            if (user.email !== tokenUser.user.email) {
                req.logger.warning("No puede subir archivos a otro usuario!");
                return res.status(404).send({ status: "error", message: "Usuario diferente" });
            }

            for (const [key, value] of Object.entries(req.files)) {
                //console.log(key, value);
                //console.log(user.documents.some((document) => document.name.includes(key)));
                //valido si ya se cargo una imagen para ese tipo de archivo. si ya se cargo la piso.
                if (user.documents.some((document) => document.name.includes(key))) {
                    const existingDocumentIndex = user.documents.findIndex((document) => document.name.includes(key));
                    let nameMatchingDocument = user.documents[existingDocumentIndex].name;
                    await UserModel.updateOne(
                        { _id: uid, "documents.name": nameMatchingDocument },
                        { $set: { "documents.$.name": value[0].filename, "documents.$.reference": value[0].path } }
                    );
                } else {
                    await UserModel.updateOne({ _id: uid }, { $push: { documents: { name: value[0].filename, reference: value[0].path } } });
                }
            }

            res.status(200).send({
                status: "success",
                payload: `Archivos subidos correctamente.`,
            });
            //res.sendSuccess(result);
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    deleteUsers = async (req, res) => {
        try {
            let html = `<div>
            <h1>Se ah borrado su usuario por inactividad </h1>
            </div>`;
            let users = await userService.getUsers();
            let fechaActual = new Date();
            users.forEach(async (user) => {
                let diferencia = fechaActual - new Date(user.lastConnection);
                let dias = diferencia / (1000 * 60 * 60 * 24);
                if (dias >= 2) {
                    let usuario = await userService.getUserByEmail(user.email);
                    let email = await sendMail(user.email, "Usuario Inactivo", html);
                    let result = await userService.deleteUser(usuario._id);
                }
            });
            res.sendSuccess("Se borraron usuarios con ultima conexion mayor a 2 dias.");
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };
}

module.exports = new UserController();
