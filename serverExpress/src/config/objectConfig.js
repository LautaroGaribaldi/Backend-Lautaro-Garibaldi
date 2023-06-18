const { connect } = require("mongoose");
const dotenv = require("dotenv");
const { commander } = require("../utils/commander");

const { mode } = commander.opts();

dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production",
});

module.exports = {
    // genero la coneccion y muestro un mensaje
    port: process.env.PORT,
    connectDB: () => {
        connect(process.env.MONGO_URL);
        console.log("Base de datos conectada");
    },
};
