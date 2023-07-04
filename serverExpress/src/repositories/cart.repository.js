class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCarts = () => {
        let result = this.dao.getCarts();
        return result;
    };

    getCartById = (cid) => {
        let result = this.dao.getCartById(cid);
        return result;
    };

    createCart = () => {
        let result = this.dao.createCart();
        return result;
    };

    addProduct = (cid, pid) => {
        let result = this.dao.addProduct(cid, pid);
        return result;
    };

    deleteProducts = (cid) => {
        let result = this.dao.deleteProducts(cid);
        return result;
    };

    deleteProduct = (cid, pid) => {
        let result = this.dao.deleteProduct(cid, pid);
        return result;
    };

    updateProducts = (cid, products) => {
        let result = this.dao.updateProducts(cid, products);
        return result;
    };

    updateProduct = (cid, pid, quantity) => {
        let result = this.dao.updateProduct(cid, pid, quantity);
        return result;
    };
    generateTicket = (ticket) => {
        let result = this.dao.generateTicket(ticket);
        return result;
    };
}

module.exports = CartRepository;
