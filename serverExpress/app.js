const { initServer } = require("./src/server");
const cluster = require("cluster");
const { cpus } = require("os");
const { logger } = require("./src/config/logger");

//logger.info(cluster.isPrimary);
const numeroDeProcesadores = cpus().length;

//logger.info("Cantidad de hilos de mi procesador", numeroDeProcesadores);

if (cluster.isPrimary) {
    logger.info("proceso primario generando proceso trabajador");
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork();
    }
    cluster.on("message", (worker) => {
        logger.info(`El worker ${worker.process.id} dice ${worker.message}`);
    });
} else {
    logger.info("al no ser proceso forkeado no cuento como primario por lo tanto isPrimary es falso. Soy un worker.");
    initServer();
}
