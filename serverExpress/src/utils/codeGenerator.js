function codeGenerator() {
    const date = Date.now().toString(); // Obtener la marca de tiempo actual
    const prefijo = "LW-"; // lw de logic-work

    return prefijo + date;
}

module.exports = {
    codeGenerator,
};
