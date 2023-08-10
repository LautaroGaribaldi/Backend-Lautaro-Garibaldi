const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de Logic-Work", () => {
    //Testing de los endpoints de productos
    describe("Test de rutas de productos", () => {
        let productId;
        let cookieName = "coderCookieToken";
        let cookieValue =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkxhdXRhcm8iLCJsYXN0TmFtZSI6IkdhcmliYWxkaSIsImVtYWlsIjoicHJ1ZWJhQGdtYWlsLmNvbSIsImRhdGVPZkJpcnRoIjoiMS8xMi8yMDAxIiwicm9sZSI6ImFkbWluIiwiY2FydElkIjp7Il9pZCI6IjY0ZDQyZDQzMWQ4MTg3NGFlZTY3MzhhMCIsInByb2R1Y3QiOltdLCJfX3YiOjB9fSwiaWF0IjoxNjkxNjY2MTQ3LCJleHAiOjE2OTE3NTI1NDd9.5Sstnzv6vlMccmnyTwJqu2r2WWatWrNmwy6n8oRJr0I; Max-Age";
        it("El endpoint de Post /api/products debe crear un producto correctamente.", async () => {
            let productMock = {
                title: "producto superTest",
                description: "Prueba de producto por superTest",
                price: 300,
                thumbnail: ["imagen1", "imagen2"],
                code: "AAA152",
                category: "procesador",
                status: true,
                stock: 10,
                owner: "usuario@gmail.com",
            };
            const { statusCode, _body, ok } = await requester
                .post("/api/products")
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .send(productMock);
            productId = _body.payload._id;
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.payload).to.have.property("_id");
        });
        it("El endpoint de Get /api/products debe mostrar todos los productos correctamente.", async () => {
            const { statusCode, _body, ok } = await requester.get("/api/products");
            console.log(productId);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });

        it("El endpoint de Get /api/products/pid debe mostrar el producto pasado por pid correctamente.", async () => {
            const { statusCode, _body, ok } = await requester.get(`/api/products/${productId}`);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });

        it("El endpoint de Put /api/products/pid debe editar un producto correctamente.", async () => {
            let productMock = {
                title: "producto superTest editado",
                stock: 17,
            };
            const { statusCode, _body, ok } = await requester
                .put(`/api/products/${productId}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .send(productMock);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });

        it("El endpoint de Delete /api/products/pid debe Borrar un producto correctamente.", async () => {
            const { statusCode, _body, ok } = await requester.delete(`/api/products/${productId}`).set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });
    });

    //Testing de los endpoints de Sessions
    describe("test de rutas de  Sessions", () => {
        let cookie;
        let recoveryCookie = {
            name: "recoveryToken",
            value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibGF1dGFyby5nYXJpYmFsZGlAZ21haWwuY29tIn0sImlhdCI6MTY5MTY3MjI2MSwiZXhwIjoxNjkxNjc1ODYxfQ.jRr12i3IybH8-BmSDnx37MoJEM6Jiop0BXwVxlta9XU",
        };
        it("El endpoint debe registrar un usuario correctamente.", async () => {
            const userMock = {
                firstName: "Lautaro",
                lastName: "Garibaldi",
                email: "prueba@gmail.com",
                dateOfBirth: "12",
                password: "prueba123",
                admin: true,
            };
            const { statusCode, _body, ok } = await requester.post("/api/session/register").send(userMock);
            console.log(_body);
            expect(statusCode).to.be.equal(302);
        });

        it("El endpoint debe logear un usuario correctamente y devolver una cookie.", async () => {
            const userMock = {
                email: "prueba@gmail.com",
                password: "prueba123",
            };

            const result = await requester.post("/api/session/login").send(userMock);
            console.log(result.headers["set-cookie"][0]);
            const cookieResult = result.headers["set-cookie"][0];
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1],
            };
            console.log(cookie);
            expect(cookie.name).to.be.ok.and.equal("coderCookieToken");
        });

        it("El endpoint debe enviar la cookie y consultar la ruta current.", async () => {
            const { _body } = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
            console.log(_body);
            expect(_body.status).to.be.equal("success");
        });

        it("El endpoint debe enviar la cookie y consultar la ruta privada. solo accesible si es admin el usuario.", async () => {
            const { _body } = await requester.get("/api/session/privada").set("Cookie", [`${cookie.name}=${cookie.value}`]);
            console.log(_body);
            expect(_body.status).to.be.equal("success");
        });

        it("El endpoint debe Enviar un correo correctamente y  de recuperacion de password.", async () => {
            const userEmail = {
                email: "lautaro.garibaldi@gmail.com",
            };

            const result = await requester.post("/api/session/recoveryPasswordMail").send(userEmail);
            expect(result._body.status).to.be.equal("success");
        });

        it("El endpoint debe cambiar la contraseña del usuario pasado por cookie.", async () => {
            const userNewPass = {
                password: "lauta12345",
            };

            const { statusCode, _body, ok } = await requester
                .post("/api/session/recoveryPassword")
                .set("Cookie", [`${recoveryCookie.name}=${recoveryCookie.value}`])
                .send(userNewPass);
            expect(_body.status).to.be.equal("success");
        });

        it("El endpoint debe cerrar la sesion borrando la cookie.", async () => {
            const { statusCode, _body, ok, headers } = await requester.get("/api/session/logout");
            expect(statusCode).to.be.equal(302);
        });
    });

    //Testing de los endpoints de Carts
    describe("Test de rutas de Carts", () => {
        let cookieName = "coderCookieToken";
        let cookieValue =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkxhdXRhcm8iLCJsYXN0TmFtZSI6IkdhcmliYWxkaSIsImVtYWlsIjoicHJ1ZWJhQGdtYWlsLmNvbSIsImRhdGVPZkJpcnRoIjoiMS8xMi8yMDAxIiwicm9sZSI6ImFkbWluIiwiY2FydElkIjp7Il9pZCI6IjY0ZDQyZDQzMWQ4MTg3NGFlZTY3MzhhMCIsInByb2R1Y3QiOltdLCJfX3YiOjB9fSwiaWF0IjoxNjkxNjY2MTQ3LCJleHAiOjE2OTE3NTI1NDd9.5Sstnzv6vlMccmnyTwJqu2r2WWatWrNmwy6n8oRJr0I; Max-Age";
        let cart;
        it("El endpoint deve devolver todos los carritos.", async () => {
            const { statusCode, _body, ok } = await requester.get("/api/carts/").set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(Array.isArray(_body.payload));
            console.log(ok);
            expect(Array.isArray(_body.payload)).to.be.equal(true);
        });

        it("El endpoint debe devolver el carrito pasado por cid.", async () => {
            const cid = "64809a1b00bf8f27a549b044";
            const { statusCode, _body, ok } = await requester.get(`/api/carts/${cid}`).set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("_id");
        });

        it("El endpoint debe crear un carrito.", async () => {
            const { statusCode, _body, ok } = await requester.post(`/api/carts/`).set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            cart = _body.payload._id;
            console.log(cart);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("_id");
        });

        it("El endpoint debe agregar un producto por pid al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            const pid = "645117891b516b766f362c08";
            const { statusCode, _body, ok } = await requester
                .post(`/api/carts/${cart}/product/${pid}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload.modifiedCount).to.be.equal(1);
        });

        it("El endpoint debe modificar todo el array de producto al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            //const pid = "645117891b516b766f362c07";
            const products = [
                { idProduct: "645117891b516b766f362c08", quantity: 2 },
                { idProduct: "645118051b516b766f362c0a", quantity: 5 },
            ];
            const { statusCode, _body, ok } = await requester
                .put(`/api/carts/${cart}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .send(products);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("product");
        });

        it("El endpoint debe modificar un producto por pid al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            const pid = "645118051b516b766f362c0a";
            const quantity = {
                quantity: 3,
            };
            const { statusCode, _body, ok } = await requester
                .put(`/api/carts/${cart}/product/${pid}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .send(quantity);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("product");
        });

        it("El endpoint debe borrar todo el array de producto al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            const { statusCode, _body, ok } = await requester.delete(`/api/carts/${cart}`).set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body.payload.product);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload.product).to.be.deep.equal([]);
        });

        it("El endpoint debe modificar todo el array de producto al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            //const pid = "645117891b516b766f362c07";
            const products = [
                { idProduct: "645117891b516b766f362c08", quantity: 2 },
                { idProduct: "645118051b516b766f362c0a", quantity: 5 },
            ];
            const { statusCode, _body, ok } = await requester
                .put(`/api/carts/${cart}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .send(products);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("product");
        });

        it("El endpoint debe borrar un producto por pid al carrito pasado por cid.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            const pid = "645118051b516b766f362c0a";
            const { statusCode, _body, ok } = await requester
                .delete(`/api/carts/${cart}/product/${pid}`)
                .set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body.payload).to.have.property("product");
        });

        it("El endpoint debe comprar el carrito y generar un ticket.", async () => {
            //const cid = "64d4fee140c72ef27ddac715";
            const { statusCode, _body, ok } = await requester.get(`/api/carts/${cart}/purchase/`).set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.status).to.be.equal("success");
            expect(_body).to.have.property("ticket");
        });
    });
});
