//const { Router } = require("express");

const RouterClass = require("./RouterClass.js");
//const userManager = require("../managerDaos/mongo/user.mongo.js");
//const { createHash } = require("../utils/bcryptHash.js");
const { getUsers, createUsers, updateUsers, deleteUsers, sendEmail, sendSms, updatePremium } = require("../controllers/user.controller.js");

class UserRouter extends RouterClass {
    init() {
        this.get("/", ["ADMIN"], getUsers);

        this.get("/sendEmail", ["PUBLIC"], sendEmail);

        this.get("/sendSms", ["PUBLIC"], sendSms);

        this.get("/premium/:uid", ["ADMIN"], updatePremium);

        this.post("/", ["PUBLIC"], createUsers);

        this.put("/:uid", ["PUBLIC"], updateUsers);

        this.delete("/:uid", ["PUBLIC"], deleteUsers);
    }
}

module.exports = UserRouter;
