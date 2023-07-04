//const UserDaoMongo = require("../managerDaos/mongo/user.mongo.js");
const { userService } = require("../service/index.js");
const { createHash } = require("../utils/bcryptHash");
const { sendMail } = require("../utils/sendMail.js");
const { sendSms, sendWhatsapp } = require("../utils/sendSms.js");

class UserController {
    //GET
    getUsers = async (req, res) => {
        try {
            let users = await userService.getUsers(); // busco todos mis users
            res.sendSuccess(users);
        } catch (error) {
            console.log(error);
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
            console.log(error);
            res.sendServerError(error);
        }
    };

    sendSms = async (req, res) => {
        try {
            await sendSms();
            //await sendWhatsapp();
            res.sendSuccess("sms Enviado");
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
                return res.sendServerError("Email vacio o no valido.");
            }

            /*res.status(200).send({
            status: "success",
            payload: result,
        });*/
            res.sendSuccess(result);
        } catch (error) {
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
            res.sendServerError(error);
        }
    };
}

module.exports = new UserController();
