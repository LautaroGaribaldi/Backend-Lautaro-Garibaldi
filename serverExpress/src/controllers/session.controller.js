const { userService, cartService } = require("../service/index.js");
const { CustomError } = require("../utils/CustomError/CustomError.js");
const { Errors } = require("../utils/CustomError/EErrors.js");
const { generateUserErrorInfo } = require("../utils/CustomError/info.js");
const { createHash, isValidPassword } = require("../utils/bcryptHash.js");
//const passport = require("passport");
const { generateToken, generateTokenRecovery } = require("../utils/jwt.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail.js");
//const { notLoged } = require("../middlewares/notLoged.middleware.js");
//const UserDaoMongo = require("../managerDaos/mongo/user.mongo.js"); //manager de usuarios
//const userManager = new UserDaoMongo();

class sessionControler {
    privatePage = (req, res) => {
        res.send("todo lo que esta aca solo lo ve admin logeado");
    };

    recoveryPassMail = async (req, res) => {
        try {
            const { email } = req.body;

            //Encontrar el usuario por email
            const userDB = await userService.getUserByEmail(email);

            if (!userDB) {
                req.logger.warning(`Usuario Inexistente`);
                return res.send({ status: "error", message: "No existe ese usuario. revisar" });
            }

            const accessToken = generateTokenRecovery({
                email: email,
            });

            let html = `<div>
            <h1>Se ah solicitado un cambio de contraseña</h1>
            <p>Utilice este Link para cambiar su contraseña:</p>
            <a href="/login">http://localhost:8080/recovery/${accessToken}</a>
            </div>`;

            let result = await sendMail(email, "Solicitud de recuperacion de contraseña", html);

            res.send({ status: "sucess", message: "email enviado" });
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    recoveryPass = async (req, res) => {
        try {
            const { password } = req.body;

            const token = req.cookies.recoveryToken;

            let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            console.log(user.user.email);
            const email = user.user.email;

            //Encontrar el usuario por email
            const userDB = await userService.getUserByEmail(email);

            if (!userDB) {
                req.logger.warning(`Usuario Inexistente`);
                return res.send({ status: "error", message: "No existe ese usuario. revisar" });
            }
            console.log("comparacion", isValidPassword(password, userDB));

            if (isValidPassword(password, userDB)) {
                req.logger.warning(`Esta utilizando su contraseña anteriro. Debe ser diferente`);
                return res.send({ status: "error", message: "Esta utilizando su contraseña anteriro. Debe ser diferente" });
            }

            console.log("toke", token);

            //modifico la password, la hasheo y la guardo.
            userDB.password = createHash(password);
            await userDB.save();
            res.clearCookie("recoveryToken").send({ status: "sucess", message: "Contraseña Cambiada" });
            //res.redirect("/login");
        } catch (error) {
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    githubCallback = async (req, res) => {
        req.session.user = req.user;
        if (req.session.user.email === "adminCoder@coder.com") {
            req.session.user.role = "admin";
        } else {
            req.session.user.role = "user";
        }
        //console.log("reqUser", req.user);
        res.redirect("/products");
    };

    logout = (req, res) => {
        res.clearCookie("coderCookieToken").redirect("/login");
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.logger.warning(`email y/o password vacios. Debe copletar todos los campos`);
                return res.send({ status: "error", message: "Algun campo esta vacio." });
            }
            //Verifico si existe el usuario y su contraseña
            const userDB = await userService.getUserByEmail(email);
            //let role = "";
            //console.log(userDB);
            if (!userDB) {
                req.logger.warning(`Usuario Inexistente`);
                return res.send({ status: "error", message: "No existe ese usuario. revisar" });
            }

            //Verifico si me paso la contraseña correcta para ese usuario.
            if (!isValidPassword(password, userDB)) {
                req.logger.warning(`El usuario o contraseña son incorrectos`);
                return res.status(401).send({ status: "error", message: "El usuario o contraseña son incorrectos" });
            }

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
            req.logger.fatal({ message: error });
            res.sendServerError(error);
        }
    };

    register = async (req, res, next) => {
        try {
            const { firstName, lastName, email, dateOfBirth, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                req.logger.warning(`Error al crear el usuario. todos los campos son requeridos.`);
                CustomError.createError({
                    name: "User Creation Error",
                    cause: generateUserErrorInfo({
                        firstName,
                        lastName,
                        email,
                        password,
                    }),
                    message: "Error trying to created user",
                    code: Errors.INVALID_TYPE_ERROR,
                });
            }

            // validar si existe ya el email
            const existUser = await userService.getUserByEmail(email);
            if (existUser) {
                req.logger.warning(`Error al crear el usuario. el email ya fue utilizado.`);
                return res.send({ status: "error", message: "el email ya fue utilizado" });
            }

            let newCart = await cartService.createCart();

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

            let resultUser = await userService.createUser(newUser);
            if (resultUser.ERROR) {
                req.logger.warning(`Error al crear el usuario. todos los campos son requeridos.`);
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
            req.logger.fatal({ message: error });
            next(error);
            //res.sendServerError(error);
        }
    };

    current = async (req, res) => {
        const token = req.cookies.coderCookieToken;
        let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        res.send(user.user);
    };
}

module.exports = new sessionControler();
