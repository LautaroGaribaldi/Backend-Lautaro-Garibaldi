const fs = require("fs");

class CartDaoFile {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    getCarts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8"); //leo mi archivo carts.json pasado en el path.
            this.carts = JSON.parse(data); // transformo la informacion para utilizarla
            return this.carts;
        } catch (error) {
            return [];
        }
    };

    getCartById = async (id) => {
        try {
            await this.getCarts(); // leo mis carritos
            const codeValue = this.carts.findIndex((prod) => prod.id === id); // Verifico si encuentro el codigo pasado por parametro
            if (codeValue >= 0) {
                // Si lo encuentro lo devuelvo.
                return this.carts[codeValue].products;
            }
        } catch (error) {
            console.log(error);
        }
    };
    createCart = async (cart) => {
        try {
            await this.getCarts(); // leo mis carritos
            this.carts.push(cart); //pusheo mi carrito
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, "utf-8", "\t"));
            console.log(cart); //Guardo mi array carts en mi archivo.
            return `Se ah agregado el Carrito id ${cart.id}`;
        } catch (error) {
            return error;
        }
    };

    addProduct = async (id, idProd) => {
        try {
            await this.getCarts();
            let cart = this.carts.find((cart) => cart.id === id); // busco si en mi array carts existe el id pasado.
            console.log("carrito filtrado: ", cart);
            const productRepeated = cart.products.findIndex((prod) => prod.product === idProd); // Verifico si encuentro el codigo de producto pasado por parametro
            console.log("Producto Repetido", productRepeated);
            if (productRepeated >= 0) {
                cart.products[productRepeated].quantity += 1;
            } else {
                cart.products.push({ product: idProd, quantity: 1 });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, "utf-8", "\t")); // vuelvo a guardar mi array de carts en mi archivo.
            return "Producto Actualizado";
        } catch (error) {
            return error;
        }
    };

    deleteProducts = () => {};

    deleteProduct = () => {};

    updateProducts = () => {};

    updateProduct = () => {};

    generateTicket = () => {};
}

module.exports = CartDaoFile;
