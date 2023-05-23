function auth(req, res, next) {
    if (req.session?.user?.role !== "admin") {
        return res.status(401).send("error de autenticacion");
    }
    next();
}

module.exports = {
    auth,
};
