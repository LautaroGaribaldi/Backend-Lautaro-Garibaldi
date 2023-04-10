# Servidor Express

---

[![N|Solid](https://miro.medium.com/v2/resize:fit:365/1*Jr3NFSKTfQWRUyjblBSKeg.png)](https://nodesource.com/products/nsolid)

### Descripcion

---

Servidor web creado en node.js con express.js con persistencia de memoria en archivos corriendo en puerto 8080

### Endpoints

---

Una vez levantado el servido con el comando npm run dev puede consultar los siguientes endpoints:

##### GET:

-   http://localhost:8080/api/products (Devuelve todos los productos en un objeto. Tiene posibilidad de pasar limit por querry params agregando ?limit="un numero" al final del endpoint)
-   http://localhost:8080/api/products/pid (cambiar pid por id del producto a solicitar y solo devolvera ese.)
-   http://localhost:8080/api/carts/cid (cambiar cid por id del carrito a solicitar y solo devolvera ese.)

##### POST:

-   http://localhost:8080/api/products (Crea un producto con los datos pasado en el body)
-   http://localhost:8080/api/carts (Crea un carrito de productos con id y un array de productos vacios.)
-   http://localhost:8080/api/carts/:cid/product/:pid (Agrega un producto por pid al carrito pasado por cid.)

##### PUT:

-   http://localhost:8080/api/products/:pid (Modifico un producto buscandolo por pid .)

##### DELETE:

-   http://localhost:8080/api/products/:pid (Borra el producto buscandolo por pid.)

### Funcionalidades

---

##### Clase ProductManager

---

-   Funcion getProducts la cual lee un archivo pasado en el path. Devuelve los productos guardados en el. Si no existe devuelve un array vacio.
-   Funcion getProductById que recibe id como parametro, el cual lee un archivo pasado en el path. Devuelve un producto filtrando por id
-   Funcion addProducts que recibe un objeto por parametro y si todos los campos solicitados estan llenos se crea el nuevo producto con id autoincrementado.
-   Funcion updateProduct que recibe por parametro id y un objeto, el cual lee un archivo pasado en el path. Si todos los campos se pasaron modificara el producto que se paso por id y se le cambiaran los valores de sus keys.
-   Funcion deleteProduct que recibe por parametro el id, el cual lee un archivo pasado en el path. Por medio del id filtra mis productos diferentes a ese id y vuelve a grabar el nuevo array.

##### Clase CartManager

---

-   Funcion getCarts la cual lee un archivo pasado en el path. Devuelve los carritos guardados en el. Si no existe devuelve un array vacio.
-   Funcion getCartById que recibe id como parametro, el cual lee un archivo pasado en el path. Devuelve un carrito filtrando por id
-   Funcion addCart que crea un carrito. luego lee un archivo pasado en el path y pushea un carrito nuevo
-   Funcion addProducts que recibe id de carrito y id de producto por parametro. y agrega al carrito pasado por id el producto pasado por id.

### Demo

---

Parado en la ruta de app.sj (dentro de la carpeta serverExpress), correr el comando npm run dev
Luego con Postman o un buscador web vaya a " http://localhost:8080/products " para comensar a probar los endpoints.
