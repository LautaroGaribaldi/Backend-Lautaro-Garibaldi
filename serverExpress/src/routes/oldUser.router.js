const { Router } = require("express"); // Importo Router de express
//const { auth } = require("../middlewares/authentication.middleware");
const userManager = require("../managerDaos/mongo/user.mongo.js");
const { createHash } = require("../utils/bcryptHash.js");
const { authorization } = require("../passportJwt/authorizationJwtRole.js");
const { passportCall } = require("../passportJwt/passportCall.js.js");

const router = Router();

//GET
//Solo disponible si esta logeado y es admin
router.get("/", passportCall("jwt"), authorization("admin"), async (req, res) => {
    try {
        let users = await userManager.getUsers(); // busco todos mis users
        res.send({
            status: "Success",
            payload: users,
        });
    } catch (error) {
        console.log(error);
        res.send({ status: "error", ERROR: error });
    }
});
//POST
router.post("/", async (req, res) => {
    try {
        let user = req.body;
        // creo el nuevo objeto respetando el modelo de objetos pasados.
        const newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            password: createHash(user.password),
        };
        let result = await userManager.addUser(newUser); // lo creo en mi base de datos
        res.status(200).send({ result }); // devuelvo el resultado.
    } catch (error) {
        console.log(error);
        res.send({ status: "error", ERROR: error });
    }
});

//PUT

router.put("/", async (req, res) => {
    try {
        //const { email } = req.params;
        const user = req.body;

        let userToReplace = {
            firstName: user.nombre,
            lastName: user.apellido,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            password: user.password ? createHash(user.password) : undefined,
        };

        let result = await userManager.updateUserByEmail(user.email, userToReplace);

        res.status(200).send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.send({
            status: "error",
            error: error,
        });
        console.log(error);
    }
});

//DELETE

router.delete("/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        let result = await userManager.deleteUser(uid);

        res.status(200).send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.send({
            status: "error",
            error: error,
        });
        console.log(error);
    }
});

module.exports = router;
