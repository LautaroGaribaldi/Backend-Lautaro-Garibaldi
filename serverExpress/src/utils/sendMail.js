const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

exports.sendMail = async (destino, subject, html) => {
    return await transport.sendMail({
        from: "Coder Test  <lautaro.garibaldi@gmail.com>",
        //to: "lautaro.garibaldi@gmail.com",
        to: destino,
        //subject: "Prueba de SMTP",
        subject,
        /*html: `<div>
        <h1>Prueba de envio de mail por servidor </h1>
        </div>`,*/
        html,
        /*attachments: [
            {
                filename: "placa.png",
                path: __dirname + "/placa.png",
                cid: "placa",
            },
        ],*/
    });
};
