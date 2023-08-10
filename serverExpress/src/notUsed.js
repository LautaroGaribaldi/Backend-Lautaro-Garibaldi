const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const objectConfig = require("./config/objectConfig.js");
const routerApp = require("./routes");
const { Server } = require("socket.io");
const { productService, messageService } = require("./service/index.js");
// guardar en archivos los sessions
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");
//const { initPassport, initPassportGithub } = require("./config/passport.config.js");
const { initPassport } = require("./passportJwt/passport.config.js");
const passport = require("passport");
require("dotenv").config();
const cors = require("cors");

//const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
//const manager = new ProductManager(path); // Genero mi ProductManager.

const app = express();

// handelbars prueba
const handlebars = require("express-handlebars");
const { errorHandler } = require("./middlewares/error.middleware.js");
const { addLogger } = require("./middlewares/addLogger.middleware.js");
const { logger } = require("./config/logger.js");
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handelbars prueba

app.use(express.json());
app.use(cors());
app.use(addLogger);
app.use(express.urlencoded({ extended: true })); // Configuro mi servidor para que reciba  datos complejos por url.
app.use(cookieParser("Palabr4S3cret4"));
app.use("/static", express.static(__dirname + "/public"));
// con file system
// const fileStore = FileStore(session);

// app.use(
//     session({
//         store: new fileStore({
//             ttl: 100000 * 60,
//             path: "./session",
//             retries: 0,
//         }),
//         secret: "secretCoder",
//         resave: true,
//         saveUninitialized: true,
//     })
// );

//solo session
/*app.use(
    session({
        secret: "secretCoder",
        resave: true,
        saveUninitialized: true,
    })
);*/
// con mongodb
// app.use(
//     session({
//         store: create({
//             mongoUrl: "mongodb+srv://LautaroGaribaldi:Prueba123@baseprueba.emt7e6n.mongodb.net/ecommerce?retryWrites=true&w=majority",
//             mongoOptions: {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             },
//             ttl: 86400,
//         }),
//         secret: "secretCoder",
//         resave: false,
//         saveUninitialized: false,
//     })
// );

initPassport();
//initPassportGithub();
passport.use(passport.initialize());
//passport.use(passport.session());

app.use(routerApp);

/*app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Algo salio mal.");
});*/

app.use(errorHandler);

// Implementaicon de Socket.Io
const PORT = process.env.PORT;
const httpServer = app.listen(PORT, () => {
    logger.info(`Escuchando puerto ${PORT}`);
});

const io = new Server(httpServer);
/*
objectConfig.connectDB(); //una instancia de nuestra base de datos
*/
io.on("connection", (socket) => {
    logger.info("Nuevo Cliente Conectado.");

    socket.on("productDelete", async (pid) => {
        const id = await productService.getProduct(pid.id);
        if (!id || id.status === "error") {
            return socket.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` });
        }
        if (!id.error) {
            await productService.deleteProduct(pid.id);
            const data = await productService.getProducts(20);
            return io.emit("newList", data);
        }
    });

    socket.on("newProduct", async (data) => {
        let datas = await productService.createProduct(data);
        if (datas.status === "error") {
            let msgError;
            let error = datas.error;
            if (error.code === 11000) {
                msgError = `No se pudo crear el producto. code ${error.keyValue.code} repetido`;
            } else {
                msgError = "No se pudo crear el producto. algun campo no fue completado.";
            }
            return socket.emit("productAdd", { status: "error", message: msgError });
        }
        const newData = await productService.getProducts(20);
        return io.emit("productAdd", newData);
    });

    socket.on("authenticated", (data) => {
        socket.broadcast.emit("newUserConected", data);
    });

    socket.on("message", async (data) => {
        let result = await messageService.addMessage(data);
        let messagess = await messageService.getMessages();
        io.emit("messageLogs", messagess);
    });
});
