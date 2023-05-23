const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const objectConfig = require("./config/objectConfig.js");
const routerApp = require("./routes");
const { Server } = require("socket.io");
//const { ProductManager } = require("./managerDaos/productManager"); // Imp
const productManager = require("./managerDaos/mongo/product.mongo.js");
const messageManager = require("./managerDaos/mongo/messsage.mongo");
// guardar en archivos los sessions
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");

//const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
//const manager = new ProductManager(path); // Genero mi ProductManager.

const app = express();

// handelbars prueba
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handelbars prueba

app.use(express.json());
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
app.use(
    session({
        store: create({
            mongoUrl: "mongodb+srv://LautaroGaribaldi:Prueba123@baseprueba.emt7e6n.mongodb.net/ecommerce?retryWrites=true&w=majority",
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 100000 * 60,
        }),
        secret: "secretCoder",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(routerApp);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Algo salio mal.");
});
// Implementaicon de Socket.Io
const httpServer = app.listen(8080, () => {
    console.log("Escuchando puerto 8080");
});

const io = new Server(httpServer);

objectConfig.connectDB();

io.on("connection", (socket) => {
    console.log("Nuevo Cliente Conectado.");

    socket.on("productDelete", async (pid) => {
        const id = await productManager.getProductById(pid.id);
        if (!id || id.status === "error") {
            return socket.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` });
        }
        if (!id.error) {
            await productManager.deleteProduct(pid.id);
            const data = await productManager.getProducts();
            return io.emit("newList", data);
        }
    });

    socket.on("newProduct", async (data) => {
        let datas = await productManager.addProduct(data);
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
        const newData = await productManager.getProducts();
        return io.emit("productAdd", newData);
    });

    socket.on("authenticated", (data) => {
        socket.broadcast.emit("newUserConected", data);
    });

    socket.on("message", async (data) => {
        let result = await messageManager.addMessage(data);
        let messagess = await messageManager.getMessages();
        io.emit("messageLogs", messagess);
    });
});
