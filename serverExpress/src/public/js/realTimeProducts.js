const socket = io();
console.log("me conecte bien");

const formDelete = document.getElementById("formDelete");
const id = document.getElementById("deleteProd");

formDelete.addEventListener("submit", (evt) => {
    evt.preventDefault();
    socket.emit("productDelete", { id: id.value });
});

//Cambiar lista si se borra un producto en tiempo real.
socket.on("newList", (data) => {
    //console.log(data);
    let list = "";
    data.forEach(({ id, title, price, code, stock, category, description, status }) => {
        list += `
        <tr>
        <td>${id}</td>
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
