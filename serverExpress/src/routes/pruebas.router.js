const { Router } = require("express"); // Importo Router de express
const { auth } = require("../middlewares/authentication.middleware");
const { fork } = require("child_process");
const { generateUser } = require("../utils/generateUserFaker");
const { generateProduct } = require("../utils/generateProductFaker");
const compression = require("express-compression");

const router = Router();
//router.use(compression()); gzip
//brotli
router.use(
    compression({
        brotli: {
            enabled: true,
            zlib: {},
        },
    })
);

router.get("/logger", (req, res) => {
    req.logger.debug("Logger debug");
    req.logger.http("Logger http");
    req.logger.info("Logger info");
    req.logger.warning("Logger warning");
    req.logger.error("Logger error");
    req.logger.fatal("Logger fatal");
    res.send({ message: "Prueba de logger" });
});

router.get("/simple", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
        suma += i;
    }
    res.send({ status: "success", message: `El worker ${process.id} a atendido esta peticion el resultado es ${suma}` });
});

router.get("/compleja", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 5e8; i++) {
        suma += i;
    }
    res.send({ status: "success", message: `El worker ${process.id} a atendido esta peticion el resultado es ${suma}` });
});
//artillery quick --count 40 --num 50 'http://localhost:8080/pruebas/simple' -o simple.json
//artillery quick --count 40 --num 50 'http://localhost:8080/pruebas/compleja' -o compleja.json

function operacionCompleja() {
    let result = 0;
    for (let i = 0; i < 9e9; i++) {
        result += i;
    }
    return result;
}

router.get("/mocks", (req, res) => {
    let users = [];
    for (let i = 0; i < 100; i++) {
        users.push(generateUser());
    }
    res.send({ status: "success", payload: users });
});

router.get("/mockingProducts", (req, res) => {
    let products = [];
    let code = 1;
    let prefijo = "00";
    for (let i = 0; i < 100; i++) {
        if (code > 9 && code < 100) {
            prefijo = "0";
        }
        if (code >= 100) {
            prefijo = "";
        }
        products.push(generateProduct(prefijo, code));
        code++;
    }
    res.send({ status: "success", payload: products });
});

router.get("/stringMuyLargo", (req, res) => {
    let string = `Hola coder soy un string ridiculamente largo`;
    for (let i = 0; i < 5e4; i++) {
        string += `Hola coder soy un string ridiculamente largo`;
    }
    res.send(string);
});

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
