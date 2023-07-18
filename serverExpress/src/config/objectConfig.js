const { connect } = require("mongoose");
const dotenv = require("dotenv");
const { commander } = require("../utils/commander");
const { MongoSingleton } = require("../utils/singleton");

const { mode } = commander.opts();

dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production",
});

module.exports = {
    // genero la coneccion y muestro un mensaje
    persistence: process.env.PERSISTENCE,
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT,
    /*connectDB: () => {
        connect(process.env.MONGO_URL);
        console.log("Base de datos conectada");
    },*/
    connectDB: async () => await MongoSingleton.getInstance(),
};
