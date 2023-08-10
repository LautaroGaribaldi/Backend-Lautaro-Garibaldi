const mongoose = require("mongoose");
const ProductDao = require("../src/managerDaos/mongo/product.mongo");
const chai = require("chai");

mongoose.connect("mongodb+srv://LautaroGaribaldi:Prueba123@baseprueba.emt7e6n.mongodb.net/test?retryWrites=true&w=majority");
const expect = chai.expect;

describe("set de test Product en chai", () => {
    before(function () {
        this.productDao = new ProductDao();
    });
    beforeEach(function () {
        //mongoose.connection.collections.products.drop();
        this.timeout(4000);
    });
    it("El dao debe poder obtener todos los productos en un array", async function () {
        const result = await this.productDao.getProducts();
        console.log(result);
        expect(Array.isArray(result.payload)).to.be.ok;
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
        const _id = "64d3a5f4609060822a128d35";
        let productUpdate = {
            title: "i9 12gen",
        };

        const result = await this.productDao.updateProduct(_id, productUpdate);

        const product = await this.productDao.getProductById(_id);
        console.log("editado", result);
        console.log("Traido", product);
        expect(product).to.have.property("title", productUpdate.title);
    });

    it("El dao debe borrar un producto correctamente de la basde datos", async function () {
        let productMock = {
            title: "i9 13gen",
            description: "Procesador Intel I9 12 generation",
            price: 300,
            thumbnail: ["imagen1", "imagen2"],
            code: "AAA151",
            category: "procesador",
            status: true,
            stock: 10,
            owner: "usuario@gmail.com",
        };

        const result = await this.productDao.createProduct(productMock);

        console.log("creado", result);

        const resultDelete = await this.productDao.deleteProduct(result._id);

        console.log("Borrado", resultDelete);

        expect(resultDelete.deletedCount).to.deep.equal(1);
    });
});
