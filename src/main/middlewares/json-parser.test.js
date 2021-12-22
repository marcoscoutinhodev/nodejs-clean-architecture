const request = require("supertest");
const app = require("../config/app");

describe("Json Parser Middleware", () => {
    test("Should parse body as JSON", async () => {
        app.post("/test_json_parser", (req, res) => {
            res.send(req.body);
        });

        await request(app)
            .post("/test_json_parser")
            .send({ email: "any_email@email.com" })
            .expect({ email: "any_email@email.com" });
    });
});