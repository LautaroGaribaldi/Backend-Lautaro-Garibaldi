//Middleware para verificar si un usario es admin y puede acceder a cierto dato sensible.
//Si no es admin lo llevo a su perfil. pero si no esta logeado lo llevo a login
function auth(req, res, next) {
    if (req.session?.user?.role !== "admin") {
        if (req.session.user) {
            return res.redirect("/profile");
        } else {
            return res.redirect("/login");
        }
        //return res.status(401).send("error de autenticacion");
    }
    next();
}

module.exports = {
    auth,
};
