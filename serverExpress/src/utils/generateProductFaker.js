const { faker } = require("@faker-js/faker");

exports.generateProduct = (prefijo, code) => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.helpers.arrayElement([faker.image.url()]),
        code: "AAA" + prefijo + code,
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        stock: faker.string.numeric(),
    };
};
