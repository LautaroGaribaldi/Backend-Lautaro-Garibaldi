const { Router } = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");

class RouterClass {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    //[(req,res)=>{}]
    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                //apply, ejecutara la funcion callback apuntando directamente a una
                //instancia de la clase, por eso, colocamos this para que utlice
                //solo el contexto de este router, los parametros son internos
                //de cada callback, sabemos que los params de un callback corresponden a
                //req,res,next (si es necesario)
                await callback.apply(this, params);
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error);
            }
        });
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (payload) => res.status(200).send({ status: "succcesss", payload });
        res.sendServerError = (error) => res.status(500).send({ status: "error", error });
        res.sendUserError = (error) => res.status(401).send({ status: "error", error });
        next();
    };

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();
        const authHeader = req.headers.authorization;
        //console.log(req.cookies.coderCookieToken);
        //if (!authHeader) return res.send({ status: "error", error: "not authorized" });
        if (!req.cookies.coderCookieToken) return res.status(401).send({ status: "error", error: "not authorized" });
        //const token = authHeader.split(" ")[1];
        const token = req.cookies.coderCookieToken;
        const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        //console.log(user);
        if (!policies.includes(user.user.role.toUpperCase())) return res.status(403).send({ status: "error", error: "not permission" });
        req.user = user;
        next();
    };

    get(path, polices, ...callbacks) {
        this.router.get(path, this.handlePolicies(polices), this.generateCustomResponse, this.applyCallbacks(callbacks));
    }

    post(path, polices, ...callbacks) {
        this.router.post(path, this.handlePolicies(polices), this.generateCustomResponse, this.applyCallbacks(callbacks));
    }

    put(path, polices, ...callbacks) {
        this.router.put(path, this.handlePolicies(polices), this.generateCustomResponse, this.applyCallbacks(callbacks));
    }

    delete(path, polices, ...callbacks) {
        this.router.delete(path, this.handlePolicies(polices), this.generateCustomResponse, this.applyCallbacks(callbacks));
    }
}

module.exports = RouterClass;
