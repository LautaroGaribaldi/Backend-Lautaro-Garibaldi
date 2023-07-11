const { faker } = require("@faker-js/faker");

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        departament: faker.commerce.department(),
        stock: faker.string.numeric(),
        description: faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        image: faker.image.url,
    };
};

exports.generateUser = () => {
    let numOfProducts = parseInt(faker.string.numeric({ length: 1, exclude: ["0"] }));
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        sex: faker.person.sex(),
        dateOfBirth: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        products,
    };
};
