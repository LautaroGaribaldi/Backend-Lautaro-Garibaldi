class UsersDto {
    constructor(usersArray) {
        (this.usersArray = usersArray), (this.users = []);
    }

    getUsers = () => {
        this.usersArray.forEach((user) => {
            let { _id, firstName, lastName, email, dateOfBirth, role, cartId, lastConnection } = user;
            let userToInsert = {
                _id,
                firstName,
                lastName,
                email,
                role,
                lastConnection,
            };
            this.users.push(userToInsert);
        });
        return this.users;
    };
}

module.exports = {
    UsersDto,
};
