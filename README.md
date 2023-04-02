# Servidor Express

---

[![N|Solid](https://miro.medium.com/v2/resize:fit:365/1*Jr3NFSKTfQWRUyjblBSKeg.png)](https://nodesource.com/products/nsolid)

### Descripcion

---

Servidor web creado en node.js con express.js con persistencia de memoria en archivos corriendo en puerto 8080

### Endpoints

---

Una vez levantado el servido con el comando npm run dev puede consultar los siguientes endpoints:

-   http://localhost:8080/products (Devuelve todos los productos en un objeto. Tiene posibilidad de pasar limit por querry params agregando ?limit="un numero" al final del endpoint)
-   http://localhost:8080/products/pid (cambiar pid por id del producto a solicitar y solo devolvera ese.)

### Funcionalidades

---

##### Clase ProductManager

---

-   Funcion getProducts la cual lee un archivo pasado en el path. Devuelve los productos guardados en el. Si no existe devuelve un array vacio.
-   Funcion getProductById que recibe id como parametro, el cual lee un archivo pasado en el path. Devuelve un producto filtrando por id
-   Funcion addProducts que recibe un objeto por parametro y si todos los campos solicitados estan llenos se crea el nuevo producto con id autoincrementado.
-   Funcion updateProduct que recibe por parametro id y un objeto, el cual lee un archivo pasado en el path. Si todos los campos se pasaron modificara el producto que se paso por id y se le cambiaran los valores de sus keys.
-   Funcion deleteProduct que recibe por parametro el id, el cual lee un archivo pasado en el path. Por medio del id filtra mis productos diferentes a ese id y vuelve a grabar el nuevo array.

##### Servidor

---

-   Endpoint para consultar todos los productos (/products) con la posibilidad de definir limit por query param.
-   Endpoint para consultar un producto buscando por su id (/products/pid)

### Demo

---

Parado en la ruta de app.sj (dentro de la carpeta serverExpress), correr el comando npm run dev
Luego con Postman o un buscador web vaya a " http://localhost:8080/products " para comensar a probar los endpoints.

Dentro del archivo productManager.js en la linea 97 en adelante se encuentra un codigo comentado el cual sirve para probar las funciones de la clase ProductManager.
Este crea, busca por id, trae todos, borra y modifica productos de mi archivo.
