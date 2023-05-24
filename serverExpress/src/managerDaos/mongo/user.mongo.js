const { userModel } = require("./model/user.model");

class UserManagerMongo {
    getUsers = async () => {
        try {
            return await userModel.find();
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    getUserByEmail = async (email) => {
        try {
            return await userModel.findOne({ email: email });
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    getUserByEmailAndPass = async (email, password) => {
        try {
            return await userModel.findOne({ email: email, password: password });
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    addUser = async (newUser) => {
        try {
            return await userModel.create(newUser);
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    updateUser = async (uid, userToReplace) => {
        try {
            return await userModel.updateOne({ _id: uid }, userToReplace);
        } catch (error) {
            return { status: "error", error: error };
        }
    };

    deleteUser = async (uid) => {
        try {
            return await userModel.deleteOne({ _id: uid });
        } catch (error) {
            return { status: "error", error: error };
        }
    };
}

module.exports = new UserManagerMongo();
