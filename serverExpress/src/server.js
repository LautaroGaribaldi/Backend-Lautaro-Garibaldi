const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const objectConfig = require("./config/objectConfig.js");
const routerApp = require("./routes");
const { Server: ServerHTTP } = require("http");
const { Server: ServerIO } = require("socket.io");
//const { initPassport, initPassportGithub } = require("./config/passport.config.js");
const { initPassport } = require("./passportJwt/passport.config.js");
const passport = require("passport");
require("dotenv").config();
const cors = require("cors");

//swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

const app = express();
const serverHttp = new ServerHTTP(app);
const io = new ServerIO(serverHttp);

// handelbars
const handlebars = require("express-handlebars");
const { errorHandler } = require("./middlewares/error.middleware.js");
const { addLogger } = require("./middlewares/addLogger.middleware.js");
const { logger } = require("./config/logger.js");
const { socketMessage } = require("./utils/socketMessage.js");
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handelbars

app.use(express.json());
app.use(cors());
app.use(addLogger);
app.use(express.urlencoded({ extended: true })); // Configuro mi servidor para que reciba  datos complejos por url.
app.use(cookieParser("Palabr4S3cret4"));
app.use("/static", express.static(__dirname + "/public"));

initPassport();
//initPassportGithub();
passport.use(passport.initialize());

app.use(routerApp);

/*app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Algo salio mal.");
});*/

app.use(errorHandler);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion de LogicWork",
            description: "Esta es la primera documentacion de LogicWork",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsDoc(swaggerOptions);

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Implementaicon de Socket.Io
const PORT = process.env.PORT || 8080;
socketMessage(io);

// exports.initServer = () =>
//     serverHttp.listen(PORT, () => {
//         logger.info(`Escuchando puerto ${PORT}`);
//     });

serverHttp.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`);
});
