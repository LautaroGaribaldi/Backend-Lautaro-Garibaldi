// function operacionCompleja() {
//     let result = 0;
//     for (let i = 0; i < 9e9; i++) {
//         result += i;
//     }
//     return result;
// }

process.on("message", (message) => {
    console.log(message);
    let result = 0;
    for (let i = 0; i < 9e9; i++) {
        result += i;
    }
    process.send(result);
});
