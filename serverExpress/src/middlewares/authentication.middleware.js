function auth(req, res, next) {
    if (req.session?.user !== "lautaro" || !req.session?.admin) {
        return res.status(401).send("error de autenticacion");
    }
    next();
}

module.exports = {
    auth,
};
