//const { Router } = require("express");

const RouterClass = require("./RouterClass.js");
const userManager = require("../managerDaos/mongo/user.mongo.js");

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
                res.send({
                    status: "Success",
                    payload: users,
                });
            } catch (error) {
                console.log(error);
                res.sendServerError(error);
            }
        });
    }
}

module.exports = UserRouter;
