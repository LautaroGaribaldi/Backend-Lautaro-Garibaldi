//dao de productos y realizar test
const mongoose = require("mongoose");
const ProductDao = require("../src/managerDaos/mongo/product.mongo");
const Assert = require("assert");

mongoose.connect("mongodb+srv://LautaroGaribaldi:Prueba123@baseprueba.emt7e6n.mongodb.net/test?retryWrites=true&w=majority");

const assert = Assert.strict;

describe("Testing de Product Dao", () => {
    before(function () {
        this.productDao = new ProductDao();
    });
    beforeEach(function () {
        //mongoose.connection.collections.products.drop();
        this.timeout(4000);
    });
    it("El dao debe traer un producto correctamente de la basde datos", async function () {
        const result = await this.productDao.getProducts();
        assert.strictEqual(Array.isArray(result.payload), true);
    });

    /*it("El dao debe crear un producto correctamente de la basde datos", async function () {
        let productMock = {
            title: "i9 12gen",
            description: "Procesador Intel I9 12 generation",
            price: 300,
            thumbnail: ["imagen1", "imagen2"],
            code: "AAA150",
            category: "procesador",
            status: true,
            stock: 10,
            owner: "usuario@gmail.com",
        };

        const result = await this.productDao.createProduct(productMock);

        const product = await this.productDao.getProductBy({ title: result.title });
        console.log("guardado", result);
        console.log("Traido", product);
        assert.strictEqual(typeof product, "object", true);
    });*/

    it("El dao debe modificar un producto correctamente de la basde datos", async function () {
        const _id = "64d39817e27e158bcf4e583c";
        let productUpdate = {
            title: "i9 12gen",
        };

        const result = await this.productDao.updateProduct(_id, productUpdate);

        const product = await this.productDao.getProductById(_id);
        console.log("editado", result);
        console.log("Traido", product);
        assert.strictEqual(product.title, productUpdate.title);
    });

    it("El dao debe borrar un producto correctamente de la basde datos", async function () {
        const _id = "64d39817e27e158bcf4e583c";

        const result = await this.productDao.deleteProduct(_id);

        const product = await this.productDao.getProductById(_id);
        assert.strictEqual(result.deletedCount, 1);
    });
});
