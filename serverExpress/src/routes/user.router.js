//const { Router } = require("express");

const RouterClass = require("./RouterClass.js");
//const userManager = require("../managerDaos/mongo/user.mongo.js");
//const { createHash } = require("../utils/bcryptHash.js");
const { getUsers, createUsers, updateUsers, deleteUsers } = require("../controllers/user.controller.js");

class UserRouter extends RouterClass {
    init() {
        this.get("/", ["ADMIN"], getUsers);

        this.post("/", ["PUBLIC"], createUsers);

        this.put("/", ["PUBLIC"], updateUsers);

        this.delete("/:uid", ["PUBLIC"], deleteUsers);
    }
}

module.exports = UserRouter;
