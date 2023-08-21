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
} = require("../controllers/user.controller.js");
const { uploader } = require("../utils/multer.js");

class UserRouter extends RouterClass {
    init() {
        this.get("/", ["ADMIN"], getUsers);

        this.get("/sendEmail", ["PUBLIC"], sendEmail);

        this.get("/sendSms", ["PUBLIC"], sendSms);

        this.get("/premium/:uid", ["ADMIN", "USER", "PREMIUM"], updatePremium);

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

        this.put("/:uid", ["PUBLIC"], updateUsers);

        this.delete("/:uid", ["PUBLIC"], deleteUsers);
    }
}

module.exports = UserRouter;
