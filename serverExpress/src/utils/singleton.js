const { connect } = require("mongoose");
const dotenv = require("dotenv");

class MongoSingleton {
    static #instance;
    constructor() {
        connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    static getInstance() {
        if (this.#instance) {
            console.log("Base de datos ya esta creada");
            return this.#instance;
        }
        this.#instance = new MongoSingleton();
        console.log("Base de  datos creada");
        return this.#instance;
    }
}

module.exports = {
    MongoSingleton,
};
