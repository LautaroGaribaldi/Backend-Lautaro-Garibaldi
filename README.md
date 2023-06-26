# Servidor Express

---

[![N|Solid](https://miro.medium.com/v2/resize:fit:365/1*Jr3NFSKTfQWRUyjblBSKeg.png)](https://nodejs.org/es) [![N|Solid](https://cdn.iconscout.com/icon/free/png-256/free-mongodb-226029.png)](https://www.mongodb.com/)

### Descripcion

---

Servidor web basado en capas creado en node.js con express.js con base de datos MongoDB.

##### Metodo de autenticacion:

-   JSON Web Token

##### Patrones implementados:

-   Factory
-   Repository

### Dependencias

---

    bcrypt: 5.1.0                       | Permite generer hash de contraseñas y realizar comprobaciones.
    commander": 11.0.0                  | Permite implementar comandos al inicio del servidor.
    connect-mongo: 5.0.0                | Permite guardar sessions en MongoDB.
    cookie-parser: 1.4.6                | permite manejar cookies al servidor.
    cors: 2.8.5                         | Permite los accesos de origenes externos al servidor.
    dotenv: 16.0.3                      | Permite utilizar variables de entorno en process.
    express: 4.18.2                     | Framework para Node.js que permite la creacion de servidores.
    express-handlebars: 7.0.6           | Motor de plantilas para generar vistas.
    express-session: 1.17.3             | Permite generar sessions en nuestro servidor.
    jsonwebtoken: 9.0.0                 | Permite crear tokens de sesion con la informacion del usuario.
    mongoose: 7.1.0                     | Libreria de modelado de datos orientada a objetos para MongoDB y Node.js.
    mongoose-paginate-v2: 1.7.1         | Libreria que permite paginar nuestros productos.
    multer: 1.4.5-lts.1                 | Middelware que permite subir archivos a nuestro servidor.
    passport: 0.6.0                     | Middelware que permite realizar autenticaciones.
    passport-github2: 0.1.12            | Permite la autenticacion con cuenta de github
    passport-jwt: 4.0.1                 | Permite la auteticacion con JSON Web Token
    passport-local: 1.0.0               | Permite la autenticacion con uso de sessions
    session-file-store: 1.5.0           | Permite guardar las sessions en archivos
    socket.io: 4.6.1                    | Libreria que permite generar una conexion web socket.

### Iniciar Servidor

---

Existen dos comandos para iniciar el servidor:

-   npm run dev (Inicia el servidor con variables de entorno Development con Nodemon corriendo en el puerto 8080).
-   npm run start (Inicia el servidor con variables de entorno Production con Node corriendo en el puerto 4000).

### Endpoints

---

Una vez levantado el servido con el comando npm run dev puede consultar los siguientes endpoints:

##### GET:

-   http://localhost:8080/api/products (Devuelve todos los productos en un objeto. Tiene posibilidad de pasar limit por querry params agregando ?limit="un numero" al final del endpoint)
-   http://localhost:8080/api/products/pid (cambiar pid por id del producto a solicitar y solo devolvera ese.)
-   http://localhost:8080/api/carts/cid (cambiar cid por id del carrito a solicitar y solo devolvera ese.)
-   http://localhost:8080/api/users (Devuelve todos los usuarios. Solo pueden usarlo usuarios con rol admin.)
-   http://localhost:8080/api/session/privada (Endpoint privado. Solo pueden usarlo usuarios con rol admin.)
-   http://localhost:8080/api/session/current (Devuelve los datos no sensibles del usuario conectado.)
-   http://localhost:8080/api/session/logout (Elimina el token para generar el logout.)
-

##### POST:

-   http://localhost:8080/api/products (Crea un producto con los datos pasado en el body)
-   http://localhost:8080/api/carts (Crea un carrito de productos con id y un array de productos vacios.)
-   http://localhost:8080/api/carts/:cid/product/:pid (Agrega un producto por pid al carrito pasado por cid.)
-   http://localhost:8080/api/users (Crea un usuario con los datos pasados en el body.)
-   http://localhost:8080/api/session/login (Verifica el email y password pasados en el body. Si corresponden a un usuario registrado genera un token y se logea.)
-   http://localhost:8080/api/session/register (Crea un usuario con los datos pasados por un formulario en el body. Verifica que el email no haya sido utilizado. Si no fue utilizado crea el usuario, genera un token y se logea con el nuevo usuario.)
-   http://localhost:8080/api/session/restaurarPass (Modifica la contraseña de un usuario pasando el email y la nueva password en el body.)

##### PUT:

-   http://localhost:8080/api/products/:pid (Modifico un producto buscandolo por pid .)
-   http://localhost:8080/api/carts/:cid (Modifica el array de productos completo con un nuevo array de productos pasados en el body al carrito pasado por cid.)
-   http://localhost:8080/api/carts/:cid/product/:pid (Modifica la cantidad del producto pasado por pid en el carrito pasado por cid.La cantidad nueva debe ser enviada en el body.)
-   http://localhost:8080/api/users/:uid (Modifica el usuario pasado por uid con los nuevos datos pasados en el body.)

##### DELETE:

-   http://localhost:8080/api/products/:pid (Borra el producto buscandolo por pid.)
-   http://localhost:8080/api/carts/:cid/product/:pid (Borra en el carrito pasado por cid el producto pasado por pid.)
-   http://localhost:8080/api/carts/:cid (Borra todos los productos del carrito pasado por cid.)
-   http://localhost:8080/api/users/:uid (Borra el usuario pasado por uid.)

### Middleware

---

-   loged.middleware.js (Valida si el usuario esta logeado. Si lo esta redirige a /products.)
-   notLoged.middleware (Valida si el usuario no esta logeado. Si no esta logeado lo redirige a /login)

### Vistas

---

-   http://localhost:8080/ (Vista de tabla de productos.)
-   http://localhost:8080/products (Vista paginada de productos.)
-   http://localhost:8080/carts/:cid (Vista del carrito pasado por cid. Solo pueden usarlo usuarios con rol admin.)
-   http://localhost:8080/chat (chat que guarda los mensajes en base de datos.)
-   http://localhost:8080/realTimeProducts (Vista de productos con socket io. tiene 2 formularios para borrar y para crear productos. Solo pueden usarlo usuarios con rol admin)
-   http://localhost:8080/login (Vista de formulario de login. si el login es exitoso redirecciona a products. Si ya esta logeado redirecciona a products)
-   http://localhost:8080/register (Vista de formulario de register. si el register es exitoso logea al usuario creado y redirecciona a /products. Si ya esta logeado redirecciona a products)
-   http://localhost:8080/recoveryPassword (Vista de formulario para recuperar contraseña. Si ya esta logeado redirecciona a products.)
-   http://localhost:8080/profile (Vista de perfil del usuario. si no se ha logeado redirecciona al login)

### Funcionalidades

---

##### Clase ProductDaoMongo

---

-   Funcion getProducts la cual devuelve los productos guardados paginados.(Puede recibir limit,page,query y sort.)
-   Funcion getProductById que recibe id como parametro, el cual devuelve un producto filtrando por id
-   Funcion createProduct que recibe un objeto por parametro y si todos los campos solicitados estan llenos se crea el nuevo producto.
-   Funcion updateProduct que recibe por parametro id y un objeto. si encuentra el producto lo modifica por los propiedades y valores pasadas en el objeto.
-   Funcion deleteProduct que recibe por parametro el id. Si encuentra el producto con el id pasado lo borra de mi coleccion.

##### Clase CartDaoMongo

---

-   Funcion getCarts la cual devuelve los carritos guardados. Si no existe devuelve un array vacio.
-   Funcion getCartById que recibe id como parametro, el cual devuelve un carrito filtrando por id
-   Funcion createCart que crea un carrito. y lo agrega a mi coleccion.
-   Funcion addProduct que recibe id de carrito y id de producto por parametro. y agrega al carrito pasado por id el producto pasado por id.
-   Funcion deleteProducts que recibe id de carrito por parametro y borra todos los productos del carrito dejando un array vacio.
-   Funcion deleteProduct que recibe id de carrito y id de producto por parametro. Luego borra el producto solicitado del carrito pasado.
-   Funcion updateProducts que recibe id de carrito y un array de productos por parametro. Modifica todos los productos en el carrito por el array pasado.
-   Funcion updateProduct que recibe id de carrito, id de producto y la cantidad por parametro. Luego modifica la cantidad del producto solicitado en el carrito pasado.

##### Clase UserDaoMongo

---

-   Funcion getUsers la cual devuelve los usuarios guardados.
-   Funcion getUserById que recibe uid como parametro, el cual devuelve un usuario filtrando por email
-   Funcion getUserByEmail que recibe email como parametro, el cual devuelve un usuario filtrando por email
-   Funcion getUserByEmailAndPass que recibe email y password como parametro. El cual devuelve un usuario filtrando por email y password.
-   Funcion createUser que recibe un objeto por parametro y si todos los campos solicitados estan llenos se crea el nuevo usuario.
-   Funcion updateUser que recibe por parametro uid y un objeto. si encuentra el usuario lo modifica por los propiedades y valores pasadas en el objeto.
-   Funcion updateUserByEmail que recibe por parametro email y un objeto. si encuentra el usuario lo modifica por los propiedades y valores pasadas en el objeto.
-   Funcion deleteUser que recibe por parametro el uid. Si encuentra el usuario con el id pasado lo borra de mi coleccion..

##### Clase MessagesDaoMongo

---

-   Funcion getMessages que devuelve todos los mensajes guardados.
-   Funcion addMessage que recibe un objeto newMessage y lo agrega a mis mensajes.

### Demo

---

Parado en la ruta de app.sj (dentro de la carpeta serverExpress), correr el comando npm run dev
Luego con Postman o un buscador web vaya a " http://localhost:8080/products " para comenzar a probar los endpoints.
