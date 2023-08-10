const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de Logic-Work", () => {
    describe("Test de producto", () => {
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
            console.log("fifi", productId);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });

        it("El endpoint de Get /api/products/pid debe mostrar todos los productos correctamente.", async () => {
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

    describe("test de Sessions", () => {
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
            //console.log(statusCode);
            console.log(_body);
            //console.log(ok);
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

    describe("Test de Carts", () => {
        let cookieName = "coderCookieToken";
        let cookieValue =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkxhdXRhcm8iLCJsYXN0TmFtZSI6IkdhcmliYWxkaSIsImVtYWlsIjoicHJ1ZWJhQGdtYWlsLmNvbSIsImRhdGVPZkJpcnRoIjoiMS8xMi8yMDAxIiwicm9sZSI6ImFkbWluIiwiY2FydElkIjp7Il9pZCI6IjY0ZDQyZDQzMWQ4MTg3NGFlZTY3MzhhMCIsInByb2R1Y3QiOltdLCJfX3YiOjB9fSwiaWF0IjoxNjkxNjY2MTQ3LCJleHAiOjE2OTE3NTI1NDd9.5Sstnzv6vlMccmnyTwJqu2r2WWatWrNmwy6n8oRJr0I; Max-Age";
        it("El endpoint deve devolver todos los carritos.", async () => {
            const { statusCode, _body, ok } = await requester.get("/api/carts/").set("Cookie", [`${cookieName}=${cookieValue}`]);
            console.log("fafe", statusCode);
            console.log("fafa", Array.isArray(_body.payload));
            console.log("fafi", ok);
            expect(Array.isArray(_body.payload)).to.be.equal(true);
        });
    });
});
