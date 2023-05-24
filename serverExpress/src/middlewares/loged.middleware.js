//Middleware para comprobar si el usario esta logeado
function loged(req, res, next) {
    if (req.session.user) {
        return res.redirect("/products");
    }
    next();
}

module.exports = {
    loged,
};
