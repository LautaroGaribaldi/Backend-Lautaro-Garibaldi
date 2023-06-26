//traer una instancias de los daos

const { ContactDao, ProductDao, UserDao, CartDao, MessageDao } = require("../managerDaos/factory");
const ContactRepository = require("../repositories/contact.repository");
const ProductRepository = require("../repositories/product.repository");
const UserRepository = require("../repositories/user.repository");
const MessageRepository = require("../repositories/message.repository");
const CartRepository = require("../repositories/cart.repository");

const contactService = new ContactRepository(new ContactDao());
const userService = new UserRepository(new UserDao());
const productService = new ProductRepository(new ProductDao());
const cartService = new CartRepository(new CartDao());
const messageService = new MessageRepository(new MessageDao());

module.exports = {
    userService,
    cartService,
    productService,
    messageService,
    contactService,
};
