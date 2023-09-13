//traer una instancias de los daos

const { ContactDao, ProductDao, UserDao, CartDao, MessageDao } = require("../managerDaos/factory");
const ContactRepository = require("../repositories/contact.repository");
const ProductRepository = require("../repositories/product.repository");
const UserRepository = require("../repositories/user.repository");
const MessageRepository = require("../repositories/message.repository");
const CartRepository = require("../repositories/cart.repository");

//const contactService = new ContactRepository(ContactDao);
const userService = new UserRepository(UserDao);
const productService = new ProductRepository(ProductDao);
const cartService = new CartRepository(CartDao);
const messageService = new MessageRepository(MessageDao);

module.exports = {
    userService,
    cartService,
    productService,
    messageService,
};
