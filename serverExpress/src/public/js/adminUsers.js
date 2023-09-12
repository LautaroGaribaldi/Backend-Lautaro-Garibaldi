console.log("me conecte bien");

document.querySelectorAll(".borrarUsuario").forEach((boton) => {
    const userRole = boton.parentElement.getAttribute("data-user-rol");
    if (userRole === "admin") {
        boton.setAttribute("disabled", "disabled");
    }
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        const userId = boton.parentElement.getAttribute("data-user-id");
        fetch(`/api/users/${userId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    window.location.reload();
                } else {
                    console.log("error al borrar usuario.");
                }
            })
            .catch((error) => {
                console.log("error en la solicitud", error);
            });
    });
});
