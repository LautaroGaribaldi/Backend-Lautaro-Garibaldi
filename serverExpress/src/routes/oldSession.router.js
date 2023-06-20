const { Router } = require("express");
//const { auth } = require("../middlewares/authentication.middleware"); //exporto middleware
const userManager = require("../managerDaos/mongo/user.mongo"); //manager de usuarios
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const { passportCall } = require("../passportJwt/passportCall.js.js");
const { authorization } = require("../passportJwt/authorizationJwtRole");
const router = Router();
const cartMongo = require("../managerDaos/mongo/cart.mongo");

router.get("/counter", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        return res.send(`Has visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        return res.send(`Bienvenido`);
    }
});

//endpoint privado
router.get("/privada", passportCall("jwt"), authorization("admin"), (req, res) => {
    res.send("todo lo que esta aca solo lo ve admin logeado");
});

//post de session
/*router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.send({ status: "error", message: "Algun campo esta vacio." });
        //Verifico si existe el usuario y su contraseña
        const userDB = await userManager.getUserByEmail(email);
        //console.log(userDB);
        if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });

        //Verifico si me paso la contraseña correcta para ese usuario.
        if (!isValidPassword(password, userDB)) return res.status(401).send({ status: "error", message: "El usuario o contraseña son incorrectos" });

        req.session.user = {
            firstName: userDB.firstName,
            lastName: userDB.lastName,
            email: userDB.email,
            dateOfBirth: userDB.dateOfBirth.toLocaleDateString("es-AR", { timeZone: "UTC" }),
        };
        if (email === "adminCoder@coder.com") {
            req.session.user.role = "admin";
        } else {
            req.session.user.role = "user";
        }
        res.redirect("/products");
        //return res.send({ status: "success", message: "login exitoso", session: req.session.user });
    } catch (error) {
        console.log(error);
    }
});*/

//login passaport

//coentado para poner jwt
// router.post(
//     "/login",
//     passport.authenticate("login", {
//         failureRedirect: "/api/session/failLogin",
//     }),
//     async (req, res) => {
//         if (!req.user) return res.status(401).send({ status: "error", message: "credenciales invalidas" });
//         req.session.user = {
//             firstName: req.user.firstName,
//             lastName: req.user.lastName,
//             email: req.user.email,
//             dateOfBirth: req.user.dateOfBirth.toLocaleDateString("es-AR", { timeZone: "UTC" }),
//         };
//         if (req.session.user.email === "adminCoder@coder.com") {
//             req.session.user.role = "admin";
//         } else {
//             req.session.user.role = "user";
//         }
//         //res.send({ status: "succes", message: "User registed" });
//         res.redirect("/products");
//     }
// );

// router.get("/failLogin", async (req, res) => {
//     console.log("fallo la estrategia de login.");
//     res.send({ status: "error", message: "Fallo la autenticacion" });
// });

router.post("/restaurarPass", async (req, res) => {
    const { email, password } = req.body;

    //Encontrar el usuario por email
    const userDB = await userManager.getUserByEmail(email);

    if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });

    //modifico la password, la hasheo y la guardo.
    userDB.password = createHash(password);
    await userDB.save();

    res.redirect("/login");
});

//guardo el usario en mi db si todo los campos son correctos y el email no se repite.
/*router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, dateOfBirth, password } = req.body;

        // validar si existe ya el email
        const existUser = await userManager.getUserByEmail(email);
        if (existUser) {
            return res.send({ status: "error", message: "el email ya fue utilizado" });
        }

        const newUser = {
            firstName,
            lastName,
            email,
            dateOfBirth,
            password: createHash(password), // encriptar contraseña
        };

        let resultUser = await userManager.addUser(newUser);
        if (resultUser.ERROR) {
            return res.status(200).send({ status: "Error", message: "Algun campo esta vacio" });
        }

        res.redirect("/login");
        //res.status(200).send({ status: "success", message: "usuario creado correctamente" });
    } catch (error) {
        console.log(error);
    }
});*/

// Comentado para agregar jwt
// router.post(
//     "/register",
//     passport.authenticate("register", {
//         failureRedirect: "/api/session/failRegister",
//     }),
//     async (req, res) => {
//         //res.send({ status: "succes", message: "User creado" });
//         res.redirect("/login");
//     }
// );

// router.get("/failRegister", async (req, res) => {
//     console.log("fallo la estrategia.");
//     res.send({ status: "error", message: "Fallo la autenticacion" });
// });

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    if (req.session.user.email === "adminCoder@coder.com") {
        req.session.user.role = "admin";
    } else {
        req.session.user.role = "user";
    }
    //console.log("reqUser", req.user);
    res.redirect("/products");
});

//destruyo la session
router.get("/logout", (req, res) => {
    /*req.session.destroy((err) => {
        if (err) {
            return res.send({ status: "error", error: err });
        } else {
            res.redirect("/login");
            //return res.send("logout ok");
        }
    });*/
    res.clearCookie("coderCookieToken").redirect("/login");
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.send({ status: "error", message: "Algun campo esta vacio." });
        //Verifico si existe el usuario y su contraseña
        const userDB = await userManager.getUserByEmail(email);
        let role = "";
        //console.log(userDB);
        if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });

        //Verifico si me paso la contraseña correcta para ese usuario.
        if (!isValidPassword(password, userDB)) return res.status(401).send({ status: "error", message: "El usuario o contraseña son incorrectos" });

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
    }
});

router.post("/register", async (req, res) => {
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
    }
});

// ruta solo disponible si esta logiado y es admin
router.get("/current", passportCall("jwt"), async (req, res) => {
    res.send(req.user);
});

module.exports = router;
