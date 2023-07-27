const RouterClass = require("./RouterClass.js");
//const UserDaoMongo = require("../managerDaos/mongo/user.mongo.js"); //manager de usuarios
//const { createHash, isValidPassword } = require("../utils/bcryptHash.js");
//const cartMongo = require("../managerDaos/mongo/cart.mongo.js");
const passport = require("passport");
//const { generateToken } = require("../utils/jwt.js");
require("dotenv").config();
//const jwt = require("jsonwebtoken");
const { notLoged } = require("../middlewares/notLoged.middleware.js");
const {
    privatePage,
    recoveryPass,
    githubCallback,
    logout,
    login,
    register,
    current,
    recoveryPassMail,
} = require("../controllers/session.controller.js");

class SessionsRouter extends RouterClass {
    init() {
        this.get("/privada", ["ADMIN"], privatePage);

        this.post("/recoveryPasswordMail", ["PUBLIC"], recoveryPassMail);

        this.post("/recoveryPassword", ["PUBLIC"], recoveryPass);

        this.get("/github", ["PUBLIC"], passport.authenticate("github", { scope: ["user:email"] }));

        this.get("/githubCallback", ["PUBLIC"], passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

        this.get("/logout", ["PUBLIC"], logout);

        this.post("/login", ["PUBLIC"], login);

        this.post("/register", ["PUBLIC"], register);

        this.get("/current", ["PUBLIC"], notLoged, current);
    }
}

module.exports = SessionsRouter;
