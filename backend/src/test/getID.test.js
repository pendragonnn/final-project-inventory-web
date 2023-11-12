const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("GET /users/:id", () => {
  it("should return a user with a valid id", async () => {
    const response = await request(app).get("/users/U-0001");
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should return 404 for an invalid id", async () => {
    const response = await request(app).get("/users/9999");
    expect(response.status).toBe(404);
  });
});
