const fs = require("fs")

class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
    }

    getProducts = async() => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')                     //leo mi archivo products.js pasado en el path.
            this.products = JSON.parse(data);                                               // transformo la informacion para utilizarla
            return this.products
        } catch (error) {
            return(error)
        }
    }

    getProductById = async (id) =>{
       this.getProducts()
       const codeValue = this.products.findIndex(prod =>prod.id === id)                       // Verifico si encuentro el codigo pasado por parametro
       if(codeValue >= 0){                                                                    // Si lo encuentro lo devuelvo.
        //console.log(this.products[codeValue])
        return (this.products[codeValue])
       }else{
        return (console.error("Not Found"))
       }
    }

    addProduct = async(producto) =>{
        this.getProducts()                                                              // leo mis productos
        try {
            if (!producto.title ||                                                      // Verifico que ningun campo este vacio
                !producto.description ||
                !producto.price ||
                !producto.thumbnail ||
                !producto.stock ||
                !producto.code) return 'Hay algun campo vacio!'
            let codProd = this.products.find(prod => prod.code === producto.code)     // Verifico si ya existe el code pasado por el producto nuevo. si existe no lo pusheo.
            if (codProd) return `Code repetido. Code ${producto.code} ya fue utilizado.`
            let prodId = 0
            if(this.products.length === 0){                         // Verifico si hay algun producto. si no lo hay el primer id es 1 sino tomo el ultimo id y le sumo 1
                prodId = 1                                          // asi evito que al borrar un producto no me repita id si solo tomara el largo de mi array products.
            } else{
                prodId= this.products[this.products.length-1].id + 1
            }
            this.products.push({id: prodId , ...producto})        //pusheo mi producto
            await fs.promises.writeFile(this.path, JSON.stringify(this.products,'utf-8','\t'))
            console.log(producto)          //Guardo mi array products en mi archivo.
            return `Se ah agregado el producto ${producto.title}`
        } catch (error) {
            return(error)
        }
    }

    updateProduct  = async (id, prod) => {
        try{
            let producto = this.products.find(prod => prod.id === id)                               // busco si en mi array products existe el id pasado.
            if (!producto) return 'Not found'
            producto.title = prod.title                                                             //si lo encuentro le paso todos los campos nuevos de mi nuevo objeto.
            producto.description = prod.description
            producto.price = prod.price
            producto.thumbnail = prod.thumbnail
            producto.stock = prod.stock
            producto.code= prod.code
            await fs.promises.writeFile(this.path, JSON.stringify(this.products,'utf-8','\t'))      // vuelvo a guardar mi array de productos en mi archivo.
            console.log(producto)
            return 'Producto Actualizado'
            }
        catch (error){
            return(error)
        }
    }

    deleteProduct  = async (idDelete) => {
        try{
            const remove = this.products.filter(prod => prod.id !== idDelete)                       // filtro mi lista para sacar el producto solicitado.
            if (!remove) return 'Id no encontrado'
            console.log(remove)
            await fs.promises.writeFile(this.path, JSON.stringify(remove,'utf-8','\t'))             // vuelvo a guardar mi archivo pero esta vez con mi lista filtrada.
            await this.getProducts()                                                                // vuelvo a cargar mi archivo para que al borrar no me quede diferente
            return `Producto id ${idDelete} Eliminado`                                                             // mi array de products y mi archivo.
        }
        catch (error){
            return(error)
        }
    }

}

//                                                                  Codigos para probar la clase ProductManager

const producto = new ProductManager("./archivos/products.json")
const testingProductManager = async() =>{
    console.log(await producto.getProducts())
    console.log("Agregado de producto 1")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.addProduct({title: 'Computadora Gamer', description: 'Computadora Gamer', price: 250, thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA001', stock: 25}))
    console.log("Agregado de producto 2")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.addProduct({title: 'Notebook gamer', description: 'Notebook gamer', price: 250, thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA002', stock: 25}))
    console.log("Agregado de producto 3")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.addProduct({title: 'Tablet', description: 'Tablet de uso domestico',price: 250, thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA003', stock: 50}))
    console.log("Agregado de producto igual code")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.addProduct({title: 'Notebook de Trabajo', description: 'Notebook de Trabajo', price: 250, thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA001', stock: 25}))
    console.log("Agregado de producto sin precio")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.addProduct({title: 'Nintendo Switch', description: 'Consola Nintendo Switch', thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA003', stock: 50}))
    console.log("Consultar productos")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.getProducts())
    console.log("Updatear producto id 1 (se le aumento el precio)")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.updateProduct(1, {title: 'Computadora Gamer', description: 'Computadora Gamer', price: 300, thumbnail: 'https://www.megatecnologia.com.ar/images/1673361801095.jpg', code: 'AAA001', stock: 50}))
    console.log("Borrado de producto id 2")
    console.log("------------------------------------------------------------------------------------")
    console.log(await producto.deleteProduct(2))
    console.log("Consulta de producto por id 2 (producto borrado)")
    console.log("------------------------------------------------------------------------------------")
    console.table(await producto.getProductById(2))
    console.log("Consulta de producto por id 3")
    console.log("------------------------------------------------------------------------------------")
    console.table(await producto.getProductById(3))
}
testingProductManager();