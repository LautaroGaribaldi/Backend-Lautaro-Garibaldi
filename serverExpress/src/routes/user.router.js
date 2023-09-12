//const { Router } = require("express");

const RouterClass = require("./RouterClass.js");
//const userManager = require("../managerDaos/mongo/user.mongo.js");
//const { createHash } = require("../utils/bcryptHash.js");
const {
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    sendEmail,
    sendSms,
    updatePremium,
    uploadDocuments,
    deleteUser,
} = require("../controllers/user.controller.js");
const { uploader } = require("../utils/multer.js");

class UserRouter extends RouterClass {
    init() {
        this.get("/", ["ADMIN"], getUsers);

        this.get("/sendEmail", ["PUBLIC"], sendEmail);

        this.get("/sendSms", ["PUBLIC"], sendSms);

        this.get("/premium/:uid", ["ADMIN", "USER", "PREMIUM"], updatePremium);

        this.get("/prueba", ["ADMIN", "USER", "PREMIUM"], deleteUsers);

        this.post("/", ["PUBLIC"], createUsers);

        this.post(
            "/:uid/documents",
            ["USER", "ADMIN", "PREMIUM"],
            uploader.fields([
                { name: "profile", maxCount: 1 },
                { name: "products", maxCount: 1 },
                { name: "identification", maxCount: 1 },
                { name: "comprobant", maxCount: 1 },
                { name: "accountStatus", maxCount: 1 },
            ]),
            uploadDocuments
        );

        this.put("/:uid", ["ADMIN"], updateUsers);

        this.delete("/:uid", ["ADMIN"], deleteUser);
    }
}

module.exports = UserRouter;
