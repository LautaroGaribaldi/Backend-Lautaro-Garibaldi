require("dotenv").config();
const twilio = require("twilio");

const cliente = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSms = () =>
    cliente.messages.create({
        body: "Mensaje de prueba twilio",
        from: process.env.TWILIO_NUMBER,
        to: process.env.MY_PHONE_NUMBER,
    });

exports.sendWhatsapp = () =>
    cliente.messages.create({
        body: "Mensaje de prueba por warap",
        from: `whatsapp:+14155238886`,
        to: `whatsapp:${process.env.MY_PHONE_NUMBER_WHATSAPP}`,
    });
