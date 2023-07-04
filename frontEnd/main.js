const productList = document.getElementById("conteiner");

fetch("http://localhost:8080/api/products", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    // body: {
    //    "nombre": "lautaro"
    // }
})
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        let html = ``;
        respuesta.payload.map((product) => {
            return (html += `<div class="card w-25">
            <div class="card-header">${product.title}</div>
            <div class="card-body">${product.description}</div>
            <div class="card-footer">
                <button class="btn btn-outline-primary">${product.price}</button>
            </div>

        </div>`);
        });
        productList.innerHTML = html;
    })
    .catch((error) => console.log(error));
