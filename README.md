# Servidor Express

---

[![N|Solid](https://miro.medium.com/v2/resize:fit:365/1*Jr3NFSKTfQWRUyjblBSKeg.png)](https://nodesource.com/products/nsolid) [![N|Solid](https://wecandonow.com/courses/mongodb/icon.png)](https://nodesource.com/products/nsolid)

### Descripcion

---

Servidor web creado en node.js con express.js con base de datos MongoDB corriendo en puerto 8080

### Endpoints

---

Una vez levantado el servido con el comando npm run dev puede consultar los siguientes endpoints:

##### GET:

-   http://localhost:8080/api/products (Devuelve todos los productos en un objeto. Tiene posibilidad de pasar limit por querry params agregando ?limit="un numero" al final del endpoint)
-   http://localhost:8080/api/products/pid (cambiar pid por id del producto a solicitar y solo devolvera ese.)
-   http://localhost:8080/api/carts/cid (cambiar cid por id del carrito a solicitar y solo devolvera ese.)
-   http://localhost:8080/ (Vista que muestra los productos en mi base de datos.)
-   http://localhost:8080/realTimeProducts (Vista que muestra los productos con conexion por web socket. cuenta con formularios para hacer post y delete de productos.)
-   http://localhost:8080/chat (Vista de chat. funciona con web socket, te pide usuario y deja mandar mensajes que se graban en la base de datos y devuelve los mensajes guardados.)

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

##### Clase ProductManagerMongo

---

-   Funcion getProducts la cual devuelve los productos guardados.
-   Funcion getProductById que recibe id como parametro, el cual devuelve un producto filtrando por id
-   Funcion addProducts que recibe un objeto por parametro y si todos los campos solicitados estan llenos se crea el nuevo producto.
-   Funcion updateProduct que recibe por parametro id y un objeto. si encuentra el producto lo modifica por los propiedades y valores pasadas en el objeto.
-   Funcion deleteProduct que recibe por parametro el id. Si encuentra el producto con el id pasado lo borra de mi coleccion.

##### Clase CartManagerMongo

---

-   Funcion getCarts la cual devuelve los carritos guardados. Si no existe devuelve un array vacio.
-   Funcion getCartById que recibe id como parametro, el cual devuelve un carrito filtrando por id
-   Funcion addCart que crea un carrito. y lo agrega a mi coleccion.
-   Funcion addProducts que recibe id de carrito y id de producto por parametro. y agrega al carrito pasado por id el producto pasado por id.

##### Clase MessagesManagerMongo

---

-   Funcion getMessages que devuelve todos los mensajes guardados.
-   Funcion addMessage que recibe un objeto newMessage y lo agrega a mis mensajes.

### Demo

---

Parado en la ruta de app.sj (dentro de la carpeta serverExpress), correr el comando npm run dev
Luego con Postman o un buscador web vaya a " http://localhost:8080/products " para comenzar a probar los endpoints.
