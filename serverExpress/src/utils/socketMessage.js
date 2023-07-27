const { logger } = require("../config/logger");
const { productService, messageService } = require("../service");
messageService;

exports.socketMessage = (io) => {
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
};
