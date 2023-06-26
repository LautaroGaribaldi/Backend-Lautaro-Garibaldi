class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (limit, page, query, sortType) => {
        let result = await this.dao.getProducts(limit, page, query, sortType);
        return result;
    };

    getProduct = async (pid) => {
        let result = await this.dao.getProductById(pid);
        return result;
    };

    createProduct = async (product) => {
        let result = await this.dao.createProduct(product);
        return result;
    };

    updateProduct = async (pid, productUpdated) => {
        let result = await this.dao.updateProduct(pid, productUpdated);
        return result;
    };

    deleteProduct = async (pid) => {
        let result = await this.dao.deleteProduct(pid);
        return result;
    };
}

module.exports = ProductRepository;
