//Middleware para comprobar si el usario esta logeado
function loged(req, res, next) {
    if (req.cookies.coderCookieToken) {
        return res.redirect("/products");
    }
    next();
}

module.exports = {
    loged,
};
