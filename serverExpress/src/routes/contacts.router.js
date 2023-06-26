const { Router } = require("express");
const contactControler = require("../controllers/contacts.controller.js");

const router = Router();

router.get("/", contactControler.getContacts);

router.post("/", contactControler.createContacts);

module.exports = router;
