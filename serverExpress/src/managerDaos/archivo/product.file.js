const fs = require("fs");

class ProductDaoFile {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8"); //leo mi archivo products.js pasado en el path.
            this.products = JSON.parse(data); // transformo la informacion para utilizarla
            return this.products;
        } catch (error) {
            return [];
        }
    };

    getProductById = async (id) => {
        try {
            await this.getProducts(); // leo mis productos
            const codeValue = this.products.findIndex((prod) => prod.id === id); // Verifico si encuentro el codigo pasado por parametro
            if (codeValue >= 0) {
                // Si lo encuentro lo devuelvo.
                return this.products[codeValue];
            }
        } catch (error) {
            console.log(error);
        }
    };

    createProduct = async (product) => {
        try {
            await this.getProducts(); // leo mis productos
            let codProd = this.products.find((prod) => prod.code === product.code);
            let prodId = 0;
            if (this.products.length === 0) {
                // Verifico si hay algun producto. si no lo hay el primer id es 1 sino tomo el ultimo id y le sumo 1
                prodId = 1; // asi evito que al borrar un producto no me repita id si solo tomara el largo de mi array products.
            } else {
                prodId = this.products[this.products.length - 1].id + 1;
            }
            if (
                !product.title || // Verifico que ningun campo este vacio
                !product.description ||
                !product.price ||
                !product.stock ||
                !product.code ||
                !product.category
            )
                return { status: "error", message: "Todos los campos son requeridos!" };

            if (product.thumbnail === undefined) {
                product.thumbnail = [];
            }
            if (product.status === undefined) {
                product.status = true;
            }
            if (codProd) return { status: "error", message: "Code repetido!" };
            this.products.push({ id: prodId, ...product }); //pusheo mi producto
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, "utf-8", "\t"));
            console.log(product); //Guardo mi array products en mi archivo.
            return `Se ah agregado el producto ${product.title}`;
        } catch (error) {
            return error;
        }
    };

    updateProduct = async (id, prod) => {
        try {
            await this.getProducts();
            let producto = this.products.find((prod) => prod.id === id); // busco si en mi array products existe el id pasado.
            producto.title = prod.title ? prod.title : producto.title; //si lo encuentro le paso todos los campos nuevos de mi nuevo objeto.
            producto.description = prod.description ? prod.description : producto.description;
            producto.price = prod.price ? prod.price : producto.price;
            producto.thumbnail = prod.thumbnail ? prod.thumbnail : producto.thumbnail;
            producto.stock = prod.stock ? prod.stock : producto.stock;
            producto.code = prod.code ? prod.code : producto.code;
            producto.category = prod.category ? prod.category : producto.category;
            producto.status = prod.status === undefined ? producto.status : prod.status;
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, "utf-8", "\t")); // vuelvo a guardar mi array de productos en mi archivo.
            console.log(producto);
            return "Producto Actualizado";
        } catch (error) {
            return error;
        }
    };

    deleteProduct = async (idDelete) => {
        try {
            await this.getProducts();
            const remove = this.products.filter((prod) => prod.id !== idDelete); // filtro mi lista para sacar el producto solicitado.
            if (!remove) return "Id no encontrado";
            await fs.promises.writeFile(this.path, JSON.stringify(remove, "utf-8", "\t")); // vuelvo a guardar mi archivo pero esta vez con mi lista filtrada.
            await this.getProducts(); // vuelvo a cargar mi archivo para que al borrar no me quede diferente
            return `Producto id ${idDelete} Eliminado`; // mi array de products y mi archivo.
        } catch (error) {
            return error;
        }
    };
}

module.exports = ProductDaoFile;
