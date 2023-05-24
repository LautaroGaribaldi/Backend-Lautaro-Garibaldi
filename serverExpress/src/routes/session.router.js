const { Router } = require("express");
const { auth } = require("../middlewares/authentication.middleware"); //exporto middleware
const userManager = require("../managerDaos/mongo/user.mongo"); //manager de usuarios
const router = Router();

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
router.get("/privada", auth, (req, res) => {
    res.send("todo lo que esta aca solo lo ve admin logeado");
});

//post de session
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //Verifico si existe el usuario y su contraseña
        const userDB = await userManager.getUserByEmailAndPass(email, password);
        if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });
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
});

//guardo el usario en mi db si todo los campos son correctos y el email no se repite.
router.post("/register", async (req, res) => {
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
            password, // encriptar contraseña
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
});

//destruyo la session
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send({ status: "error", error: err });
        } else {
            res.redirect("/login");
            //return res.send("logout ok");
        }
    });
});

module.exports = router;
