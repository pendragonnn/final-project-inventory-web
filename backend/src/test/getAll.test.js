const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("GET /users", () => {
  it("should return a list of users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
