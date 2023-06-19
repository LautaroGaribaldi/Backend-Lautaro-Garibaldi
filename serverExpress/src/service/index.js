//traer una instancias de los daos

const CartManagerMongo = require("../managerDaos/mongo/cart.mongo");
const MessagesManagerMongo = require("../managerDaos/mongo/messsage.mongo");
const ProductManagerMongo = require("../managerDaos/mongo/product.mongo");
const UserManagerMongo = require("../managerDaos/mongo/user.mongo");

//const userManager = require("../managerDaos/mongo/user.mongo");
const userService = new UserManagerMongo();
const cartService = new CartManagerMongo();
const productService = new ProductManagerMongo();
const messageService = new MessagesManagerMongo();

module.exports = {
    userService,
    cartService,
    productService,
    messageService,
};
