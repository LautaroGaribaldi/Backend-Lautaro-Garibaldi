class ProductManager{
    constructor(){
        this.products = []
    }

    getProducts = () => {
        console.log(this.products)
        return this.products;
    }

    getProductsById = (id) =>{
       const codeValue = this.products.findIndex(prod =>prod.code === id)                       // Verifico si encuentro el codigo pasado por parametro
       if(codeValue >= 0){
        console.log(this.products[codeValue])
        return (this.products[codeValue])
       }else{
        return (console.error("Not Found"))
       }
    }

    addProduct = (title="",description="",price="",thumbnail="",code="",stock="") =>{
        const product ={
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        const codeRepeated = this.products.findIndex(prod =>prod.code === product.code)     // Verifico si ya existe el code pasado por el producto nuevo. si existe no lo pusheo.
        if(codeRepeated >= 0){
            console.log("EL CODE ES REPETIDO! ESO NO PUEDE PASAR!")
        } else{
            if(Object.values(product).every(value=>value)){                                 // Verifico que todos los campos tengan valores y no esten vacios.
                if(this.products.length === 0){                                             // verifico si mi array products esta vacio. para asi declarar que id le corresponde
                    product.id = 1
                } else{
                    product.id = this.products[this.products.length-1].id + 1               // Si no es el primero busco mi ultimo id de producto y le sumo uno(autoincrementable)
                }
                this.products.push(product)
                console.log(`se ah agregado el producto ${product.title}`)
            } else{
                console.log("Hay algun campo vacio!")
            }
        }
    }

}

//                                                                  Codigos para probar la clase ProductManager

const producto = new ProductManager()
console.log("Agregado de producto")
console.log("------------------------------------------------------------------------------------")
producto.addProduct("Computadora Gamer","Computadora Gamer",250,"https://www.megatecnologia.com.ar/images/1673361801095.jpg","AAA001",50)
producto.getProducts()

console.log("Agregado de producto con igual Code")
console.log("------------------------------------------------------------------------------------")
producto.addProduct("Notebook gamer","Notebook gamer",250,"https://www.megatecnologia.com.ar/images/1673361801095.jpg","AAA001",50)
producto.getProducts()

console.log("Agregado de producto sin precio")
console.log("------------------------------------------------------------------------------------")
producto.addProduct("tablet","Tablet de uso domestico","https://www.megatecnologia.com.ar/images/1673361801095.jpg","AAA003",50)
producto.getProducts()

console.log("Agregado de producto valido")
console.log("------------------------------------------------------------------------------------")
producto.addProduct("Nintendo Switch","consola portatil Nintendo Switch", 320,"https://www.megatecnologia.com.ar/images/1673361801095.jpg","AAA103",50)
producto.getProducts()

console.log("Busqueda de producto por ID")
console.log("------------------------------------------------------------------------------------")
producto.getProductsById("AAA103")