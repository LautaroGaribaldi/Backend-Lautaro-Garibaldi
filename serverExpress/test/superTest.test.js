const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de Logic-Work", () => {
    describe("Test de producto", () => {
        /*it("El endpoint de Post /api/products debe crear un producto correctamente.", async () => {
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
            const { statusCode, _body, ok } = await requester.post("/api/products").send(productMock);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(_body.payload).to.have.property("_id");
        });*/
        /*it("El endpoint de Get /api/products debe mostrar todos los productos correctamente.", async () => {
            const { statusCode, _body, ok } = await requester.get("/api/products");
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });

        it("El endpoint de Get /api/products/pid debe mostrar todos los productos correctamente.", async () => {
            const pid = "645118051b516b766f362c0c";
            const { statusCode, _body, ok } = await requester.get(`/api/products/${pid}`);
            console.log(statusCode);
            console.log(_body);
            console.log(ok);
            expect(ok).to.be.equal(true);
        });*/
    });

    describe("test de Sessions", () => {
        let cookie;
        /*it("El endpoint debe registrar un usuario correctamente.", async () => {
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
            //console.log(_body);
            //console.log(ok);
            expect(statusCode).to.be.equal(302);
        });*/

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
    });
});
