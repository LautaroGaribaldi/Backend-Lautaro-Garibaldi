const buttonGet = document.getElementById("getCookies");
const form = document.getElementById("cookieForm"); // extraigo el formulario

//genero un evento al formulario
form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const data = new FormData(form); // genero un FormData en base a mi formulario

    const obj = {};

    data.forEach((value, key) => (obj[key] = value)); // por cada dato extraigo tanto la key como el value

    //hago fetch post a mi endpoint pasando por body el bojeto creado
    fetch("/api/session/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    })
        .then((respuesta) => respuesta.json())
        .then((respuesta) => {
            console.log(respuesta);
            //localStorage.setItem("token", respuesta.accessToken);
        });
});

buttonGet.addEventListener("click", (evt) => {
    evt.preventDefault();
    console.log(document.cookie);
});
