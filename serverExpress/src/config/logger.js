const winston = require("winston");
const config = require("./objectConfig");

/*const logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: "http" }), new winston.transports.File({ filename: "./errors.log", level: "warn" })],
});*/

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "yellow",
        info: "green",
        http: "blue",
        debug: "white",
    },
};

let logger;

switch (config.environment) {
    case "development":
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: "debug",
                    format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
                }),
            ],
        });
        break;

    case "production":
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: "info",
                    format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
                }),
                new winston.transports.File({
                    filename: "./errors.log",
                    level: "error",
                    format: winston.format.simple(),
                }),
            ],
        });
        break;

    default:
        break;
}

/*const loggerDevelpoment = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "warning",
            format: winston.format.simple(),
        }),
    ],
});

const loggerProduction = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "warning",
            format: winston.format.simple(),
        }),
    ],
});*/

module.exports = {
    logger,
};
