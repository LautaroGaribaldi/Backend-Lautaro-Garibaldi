// middleware para saber  si el usario no esta logeado
function notLoged(req, res, next) {
    if (!req.cookies.coderCookieToken) {
        return res.redirect("/login");
    }
    next();
}

module.exports = {
    notLoged,
};
