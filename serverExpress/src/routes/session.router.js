const { Router } = require("express");
const { auth } = require("../middlewares/authentication.middleware");
const { userModel } = require("../managerDaos/mongo/model/user.model");
const router = Router();

router.get("/counter", (req, res) => {
    if (req.session.counter) {
        console.log(req.session);
        req.session.counter++;
        return res.send(`${req.session.user} ah visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        return res.send(`Bienvenido ${req.session.user}`);
    }
});

router.get("/privada", auth, (req, res) => {
    res.send("todo lo que esta aca solo lo ve admin logeado");
});

router.post("/login", (req, res) => {
    const { userName, password } = req.body;
    if (userName !== "lautaro" || password !== "prueba123") {
        return res.send("Usuario y/o contraseña incorrecta");
    }
    req.session.user = userName;
    req.session.admin = true;
    console.log(req.session);
    return res.send("login exitoso");
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
            return res.send("logout ok");
        }
    });
});

module.exports = router;
