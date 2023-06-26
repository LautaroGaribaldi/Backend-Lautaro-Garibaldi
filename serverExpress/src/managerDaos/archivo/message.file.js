const fs = require("fs");

class MessageDaoFile {
    constructor(path) {
        this.messages = [];
        this.path = path;
    }

    getMessages = () => {};

    addMessage = () => {};
}

module.exports = MessageDaoFile;
