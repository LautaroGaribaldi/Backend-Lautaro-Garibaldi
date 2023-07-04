const { UsersDto } = require("../dto/users.dto");

class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => {
        let result = await this.dao.getUsers();
        let userDto = new UsersDto(result);
        let users = userDto.getUsers();
        return users;
    };

    getUserById = async (uid) => {
        let result = await this.dao.getUserById(uid);
        return result;
    };

    getUserByEmail = async (email) => {
        let result = await this.dao.getUserByEmail(email);
        return result;
    };

    getUserByEmailAndPass = async (email, password) => {
        let result = await this.dao.getUserByEmailAndPass(email, password);
        return result;
    };

    createUser = async (newUser) => {
        let result = await this.dao.createUser(newUser);
        return result;
    };

    updateUser = async (uid, userToReplace) => {
        let result = await this.dao.updateUser(uid, userToReplace);
        return result;
    };

    updateUserByEmail = async (email, userToReplace) => {
        let result = await this.dao.updateUserByEmail(email, userToReplace);
        return result;
    };

    deleteUser = async (uid) => {
        let result = await this.dao.deleteUser(uid);
        return result;
    };
}

module.exports = UserRepository;
