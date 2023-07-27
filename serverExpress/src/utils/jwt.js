const jwt = require("jsonwebtoken");
require("dotenv").config();

//no debe tener datos sensibles
const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: "1d" });
    return token;
};

const generateTokenRecovery = (user) => {
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: 3600 });
    return token;
};

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        res.status(401).send({ status: "error", error: "no autenticado" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, credential) => {
        if (error) return res.status(403).send({ status: "error", error: "no autenticado" });

        req.user = credential.user;
        next();
    });
};

module.exports = {
    generateToken,
    generateTokenRecovery,
    authToken,
};
