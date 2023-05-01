console.log("Me conecte bien a chat ");
const socket = io();
let user;
let chatbox = document.getElementById("chatbox");

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresar nombre de usuarios",
    inputValidator: (value) => {
        return !value && "el nombre de usuario es obligatorio";
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result) => {
    user = result.value;
    socket.emit("authenticated", user);
});

chatbox.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", {
                user,
                message: chatbox.value,
            });
            chatbox.value = "";
        }
    }
});

socket.on("messageLogs", (data) => {
    //console.log(data);
    let log = document.getElementById("messageLogs");
    let mensajes = "";
    data.forEach(({ user, message }) => {
        mensajes += `<li>${user} dice: ${message}</li>`;
    });
    log.innerHTML = mensajes;
});

socket.on("newUserConected", (data) => {
    if (!data) {
        return;
    }

    Swal.fire({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 10000,
        title: `${data} se ah unido al chat`,
        icon: "success",
    });
});
