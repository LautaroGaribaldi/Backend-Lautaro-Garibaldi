const socket = io();
console.log("me conecte bien");

const formDelete = document.getElementById("formDelete");

formDelete.addEventListener("submit", (evt) => {
    evt.preventDefault();
    socket.emit("productDelete", { id: formDelete.elements.deleteProd.value });
});

//Cambiar lista si se borra un producto en tiempo real.
socket.on("newList", (data) => {
    console.log(data);
    if (data.status === "error") {
        Swal.fire({
            title: "ERROR",
            text: data.message,
            icon: "error",
        });
        return console.log(data.message);
    }
    Swal.fire({
        title: "Producto borrado",
        text: `Se borro el producto ${formDelete.elements.deleteProd.value}`,
        icon: "success",
    });
    formDelete.reset();
    let list = "";
    data.payload.forEach(({ _id, title, price, code, stock, category, description, status }) => {
        list += `
        <tr>
        <td>${_id}</td>
        <td>${title}</td>
        <td>${price}</td>
        <td>${code}</td>
        <td>${stock}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${status}</td>
        </tr>`;
    });
    //console.log(list);
    const listAct =
        ` <tr>
    <th scope="col">ID</th>
    <th scope="col">Name</th>
    <th scope="col">Price</th>
    <th scope="col">code</th>
    <th scope="col">stock</th>
    <th scope="col">category</th>
    <th scope="col">description</th>
    <th scope="col">status</th>
    </tr>` + list;
    document.getElementById("tableProduct").innerHTML = listAct;
});

const addForm = document.querySelector("#addProduct");

addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(addForm.elements.thumbnail.value);

    socket.emit("newProduct", {
        title: addForm.elements.title.value,
        price: addForm.elements.price.value,
        code: addForm.elements.code.value,
        stock: addForm.elements.stock.value,
        category: addForm.elements.category.value,
        description: addForm.elements.description.value,
        status: addForm.elements.status.value,
        thumbnail: addForm.elements.thumbnail.value,
    });
});

socket.on("productAdd", (data) => {
    if (data.status === "error") {
        Swal.fire({
            title: "ERROR",
            text: data.message,
            icon: "error",
        });
        return console.log(data.message);
    }
    console.log(data);
    addForm.reset();
    let list = "";
    data.payload.forEach(({ _id, title, price, code, stock, category, description, status }) => {
        list += `<tr>
        <td>${_id}</td>
        <td>${title}</td>
        <td>${price}</td>
        <td>${code}</td>
        <td>${stock}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${status}</td>
        </tr>`;
    });

    const listaAct =
        `
    <tr>
    <th scope="col">ID</th>
    <th scope="col">Name</th>
    <th scope="col">Price</th>
    <th scope="col">code</th>
    <th scope="col">stock</th>
    <th scope="col">category</th>
    <th scope="col">description</th>
    <th scope="col">status</th>
    </tr>` + list;
    document.getElementById("tableProduct").innerHTML = listaAct;
});
