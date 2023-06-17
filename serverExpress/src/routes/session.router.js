const RouterClass = require("./RouterClass.js");
const userManager = require("../managerDaos/mongo/user.mongo.js"); //manager de usuarios
const { createHash, isValidPassword } = require("../utils/bcryptHash.js");
const cartMongo = require("../managerDaos/mongo/cart.mongo.js");
const passport = require("passport");
const { generateToken } = require("../utils/jwt.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { notLoged } = require("../middlewares/notLoged.middleware.js");

class SessionsRouter extends RouterClass {
    init() {
        this.get("/privada", ["ADMIN"], (req, res) => {
            res.send("todo lo que esta aca solo lo ve admin logeado");
        });

        this.post("/restaurarPass", ["PUBLIC"], async (req, res) => {
            try {
                const { email, password } = req.body;

                //Encontrar el usuario por email
                const userDB = await userManager.getUserByEmail(email);

                if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });

                //modifico la password, la hasheo y la guardo.
                userDB.password = createHash(password);
                await userDB.save();

                res.redirect("/login");
            } catch (error) {
                res.sendServerError(error);
            }
        });

        this.get("/github", ["PUBLIC"], passport.authenticate("github", { scope: ["user:email"] }));

        this.get("/githubCallback", ["PUBLIC"], passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
            req.session.user = req.user;
            if (req.session.user.email === "adminCoder@coder.com") {
                req.session.user.role = "admin";
            } else {
                req.session.user.role = "user";
            }
            //console.log("reqUser", req.user);
            res.redirect("/products");
        });

        this.get("/logout", ["PUBLIC"], (req, res) => {
            res.clearCookie("coderCookieToken").redirect("/login");
        });

        this.post("/login", ["PUBLIC"], async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) return res.send({ status: "error", message: "Algun campo esta vacio." });
                //Verifico si existe el usuario y su contraseña
                const userDB = await userManager.getUserByEmail(email);
                //let role = "";
                //console.log(userDB);
                if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });

                //Verifico si me paso la contraseña correcta para ese usuario.
                if (!isValidPassword(password, userDB))
                    return res.status(401).send({ status: "error", message: "El usuario o contraseña son incorrectos" });

                //console.log(userDB);
                const accessToken = generateToken({
                    firstName: userDB.firstName,
                    lastName: userDB.lastName,
                    email: userDB.email,
                    dateOfBirth: userDB.dateOfBirth.toLocaleDateString("es-AR", { timeZone: "UTC" }),
                    role: userDB.role,
                    cartId: userDB.cartId,
                });
                //console.log(accessToken);
                //res.redirect("/products");
                return res
                    .cookie("coderCookieToken", accessToken, {
                        maxAge: 86400000,
                        httpOnly: true,
                    })
                    .redirect("/products");
            } catch (error) {
                console.log(error);
                res.sendServerError(error);
            }
        });

        this.post("/register", ["PUBLIC"], async (req, res) => {
            try {
                const { firstName, lastName, email, dateOfBirth, password } = req.body;

                // validar si existe ya el email
                const existUser = await userManager.getUserByEmail(email);
                if (existUser) {
                    return res.send({ status: "error", message: "el email ya fue utilizado" });
                }

                let newCart = await cartMongo.addCart();

                //console.log("carritoNuevo", newCart);

                const newUser = {
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    password: createHash(password), // encriptar contraseña
                    cartId: newCart._id,
                    role: req.body.admin ? "admin" : "user",
                };

                let resultUser = await userManager.addUser(newUser);
                if (resultUser.ERROR) {
                    return res.status(200).send({ status: "Error", message: "Algun campo esta vacio" });
                }

                let accessToken = generateToken({
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    role: newUser.role,
                    cartId: newUser.cartId,
                });

                //res.redirect("/login");
                //Si se registro correctamente lo logeo automaticamente y llevo a products
                res.cookie("coderCookieToken", accessToken, {
                    maxAge: 86400000,
                    httpOnly: true,
                }).redirect("/products");
                //res.status(200).send({ status: "success", message: "usuario creado correctamente", accessToken });
            } catch (error) {
                console.log(error);
                res.sendServerError(error);
            }
        });

        this.get("/current", ["PUBLIC"], notLoged, async (req, res) => {
            const token = req.cookies.coderCookieToken;
            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            res.send(user.user);
        });
    }
}

module.exports = SessionsRouter;
