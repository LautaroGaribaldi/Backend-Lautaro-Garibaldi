const bcrypt = require("bcrypt");

// Crear el hash
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//generar funcion para comprarar
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword,
};
