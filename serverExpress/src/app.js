const express = require("express");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");
const { uploader } = require("./utils.js");
const { Server } = require("socket.io");
const { ProductManager } = require("./managerDaos/productManager"); // Imp

const path = "./src/archivos/products.json"; // Genero mi path para pasarle a mi clase.
const manager = new ProductManager(path); // Genero mi ProductManager.

const app = express();

// handelbars prueba
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handelbars prueba

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Configuro mi servidor para que reciba  datos complejos por url.
app.use(cookieParser());
app.use("/static", express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.post("/single", uploader.single("myfile"), async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "se subió correctamente",
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Algo salio mal.");
});
// Implementaicon de Socket.Io
const httpServer = app.listen(8080, () => {
    console.log("Escuchando puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("Nuevo Cliente Conectado.");

    socket.on("productDelete", async (pid) => {
        const id = await manager.getProductById(parseInt(pid.id));
        console.log(id);
        if (id) {
            await manager.deleteProduct(parseInt(pid.id));
            const data = await manager.getProducts();
            return socketServer.emit("newList", data);
        }
        if (!id) {
            socketServer.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` });
        }
    });

    socket.on("newProduct", async (data) => {
        let datas = await manager.addProduct(data);
        if (datas.status === "error") {
            let error = datas.message;
            return socketServer.emit("productAdd", { status: "error", message: error });
        }
        const newData = await manager.getProducts();
        return socketServer.emit("productAdd", newData);
    });
});
