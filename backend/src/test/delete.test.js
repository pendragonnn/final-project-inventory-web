const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("DELETE /users/:id", () => {
  it("should delete a user with a valid id", async () => {
    const response = await request(app).delete("/users/U-73");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(" User deleted succesfully ");
  });

  it("should return 404 for an invalid id", async () => {
    const response = await request(app).delete("/api/users/9999");
    expect(response.status).toBe(404);
  });
});
