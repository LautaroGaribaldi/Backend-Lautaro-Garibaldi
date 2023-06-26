const fs = require("fs");

class UserDaoFile {
    constructor(path) {
        this.users = [];
        this.path = path;
    }

    getUsers = () => {};

    getUserById = () => {};

    getUserByEmail = () => {};

    getUserByEmailAndPass = () => {};

    updateUser = () => {};

    updateUserByEmail = () => {};

    deleteUser = () => {};
}

module.exports = UserDaoFile;
