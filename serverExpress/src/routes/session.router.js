const { Router } = require("express");
const { auth } = require("../middlewares/authentication.middleware");
const { userModel } = require("../managerDaos/mongo/model/user.model");
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

router.get("/privada", auth, (req, res) => {
    res.send("todo lo que esta aca solo lo ve admin logeado");
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //validar email y password
        //validar email existente
        //vamos a tener una funcion para validar password
        const userDB = await userModel.findOne({ email, password });
        if (!userDB) return res.send({ status: "error", message: "No existe ese usuario. revisar" });
        req.session.user = {
            firstName: userDB.firstName,
            lastName: userDB.lastName,
            email: userDB.email,
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

router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, dateOfBirth, password } = req.body;
        console.log("coco", req.body);
        //validar si vienen vacios && caracteres especiales

        // validar si existe ya el email
        const existUser = await userModel.findOne({ email });
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

        let resultUser = await userModel.create(newUser);
        if (resultUser.ERROR) {
            return res.status(200).send({ status: "Error", message: "Algun campo esta vacio" });
        }

        res.status(200).send({ status: "success", message: "usuario creado correctamente" });
    } catch (error) {
        console.log(error);
    }
});

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
