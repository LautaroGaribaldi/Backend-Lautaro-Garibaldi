const { ContactDto } = require("../dto/contact.dto");
const { contactService } = require("../service");

class ContactsController {
    getContacts = async (req, res) => {
        let result = await contactService.getContacts();
        res.send({
            status: "success",
            payload: result,
        });
    };

    createContacts = async (req, res) => {
        let { name, lastName, phone } = req.body;
        //let newContact = new ContactDto({ name, lastName, phone });
        let result = await contactService.createContacts({ name, lastName, phone });
        res.send({
            status: "success",
            payload: result,
        });
    };
}

module.exports = new ContactsController();
