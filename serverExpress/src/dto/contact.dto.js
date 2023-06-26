class ContactDto {
    constructor(contact) {
        this.firstName = contact.name;
        this.lastName = contact.lastName;
        this.active = true;
        this.phone = contact.phone ? contact.phone.split("-").join("") : "";
    }
}

module.exports = {
    ContactDto,
};
