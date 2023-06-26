const { UserModel } = require("./model/user.model");

class UserDaoMongo {
    constructor() {
        this.userModel = UserModel;
    }
    getUsers = async () => {
        try {
            return await this.userModel.find();
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    getUserById = async (uid) => {
        return await this.userModel.findOne({ _id: uid });
    };

    getUserByEmail = async (email) => {
        try {
            return await this.userModel.findOne({ email: email });
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    getUserByEmailAndPass = async (email, password) => {
        try {
            return await this.userModel.findOne({ email: email, password: password });
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    createUser = async (newUser) => {
        try {
            return await this.userModel.create(newUser);
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    updateUser = async (uid, userToReplace) => {
        try {
            return await this.userModel.updateOne({ _id: uid }, userToReplace);
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    updateUserByEmail = async (email, userToReplace) => {
        try {
            return await this.userModel.updateOne({ email: email }, userToReplace);
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    deleteUser = async (uid) => {
        try {
            return await this.userModel.deleteOne({ _id: uid });
        } catch (error) {
            return { status: "error", error: error };
        }
    };
}

module.exports = UserDaoMongo;
