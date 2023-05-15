const { connect } = require("mongoose");

let url = "mongodb+srv://LautaroGaribaldi:<password>@baseprueba.emt7e6n.mongodb.net/ecommerce?retryWrites=true&w=majority"; // url para la conexion de mi base de datos

module.exports = {
    // genero la coneccion y muestro un mensaje
    connectDB: () => {
        connect(url);
        console.log("Base de datos conectada");
    },
};
