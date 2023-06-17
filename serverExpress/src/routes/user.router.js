//const { Router } = require("express");

const RouterClass = require("./RouterClass.js");
const userManager = require("../managerDaos/mongo/user.mongo.js");
const { createHash } = require("../utils/bcryptHash.js");

class UserRouter extends RouterClass {
    init() {
        /*this.get("/", ["PUBLIC"], async (req, res) => {
            try {
                res.sendSuccess("hola Coder");
            } catch (error) {
                res.sendServerError(error);
            }
        });*/
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                let users = await userManager.getUsers(); // busco todos mis users
                res.sendSuccess(users);
            } catch (error) {
                console.log(error);
                res.sendServerError(error);
            }
        });

        this.post("/", ["PUBLIC"], async (req, res) => {
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
                let result = await userManager.addUser(newUser); // lo creo en mi base de datos
                //res.status(200).send({ result }); // devuelvo el resultado.
                res.sendSuccess(result);
            } catch (error) {
                console.log(error);
                res.sendServerError(error);
            }
        });

        this.put("/", ["PUBLIC"], async (req, res) => {
            try {
                //const { email } = req.params;
                const user = req.body;

                let userToReplace = {
                    firstName: user.nombre,
                    lastName: user.apellido,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    password: user.password ? createHash(user.password) : undefined,
                };

                let result = await userManager.updateUserByEmail(user.email, userToReplace);
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
        });

        this.delete("/:uid", ["PUBLIC"], async (req, res) => {
            try {
                const { uid } = req.params;

                let result = await userManager.deleteUser(uid);

                /*res.status(200).send({
                    status: "success",
                    payload: result,
                });*/
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error);
            }
        });
    }
}

module.exports = UserRouter;
