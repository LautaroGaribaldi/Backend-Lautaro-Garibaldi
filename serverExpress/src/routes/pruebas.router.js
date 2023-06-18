const { Router } = require("express"); // Importo Router de express
const { auth } = require("../middlewares/authentication.middleware");
const { fork } = require("child_process");

const router = Router();

function operacionCompleja() {
    let result = 0;
    for (let i = 0; i < 9e9; i++) {
        result += i;
    }
    return result;
}

router.get("/block", (req, res) => {
    const result = operacionCompleja();
    res.send(`El resultado es:  ${result}`);
});

router.get("/noblock", (req, res) => {
    const child = fork("./src/utils/operacionCompleja.js");
    child.send("Inicia el proceso de calculo");
    child.on("message", (result) => {
        res.send(`El resultado es:  ${result}`);
    });
});

router.get("/suma", (req, res) => {
    res.send(`Hola mundo`);
});

router.post("/getCookieUser", (req, res) => {
    const { userName, email } = req.body;

    return res.cookie(userName, email, { maxAge: 1000000, signed: true }).send({ mensaje: "Seteado" });
});

router.get("/setCookie", (req, res) => {
    res.cookie("Usuario", "esta es una cookie poderosa", { maxAge: 10000000 }).send("cookie seteada");
});

router.get("/getCookie", (req, res) => {
    return res.send(req.cookies);
});

router.get("/setSignedCookie", (req, res) => {
    return res.cookie("signedCookie", "esta es una cookie muy poderosa", { maxAge: 10000000, signed: true }).send("cookie seteada");
});

router.get("/getSignedCookie", (req, res) => {
    return res.send(req.signedCookies);
});

router.get("/deleteCookie", (req, res) => {
    return res.clearCookie("Usuario").send("Cookie removed");
});

// Sessions

router.get("/session", (req, res) => {
    if (req.session.counter) {
        console.log(req.session);
        req.session.counter++;
        return res.send(`${req.session.user} ah visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        return res.send(`Bienvenido ${req.session.user}`);
    }
});

router.post("/session", (req, res) => {
    const { userName, password } = req.body;
    if (userName !== "lautaro" || password !== "prueba123") {
        return res.send("Usuario y/o contraseña incorrecta");
    }
    req.session.user = userName;
    req.session.admin = true;
    console.log(req.session);
    return res.send("login exitoso");
});

router.get("/privada", auth, (req, res) => {
    res.send("todo lo que esta aca solo lo ve admin logeado");
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
