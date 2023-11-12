const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("POST /users", () => {
  it("should create a new user", async () => {
    const userData = {
      id: "U-75",
      role_id: "R-0001",
      full_name: "Coral Merah",
      username: "deddy_adm",
      password: "deddy12",
      image_url: "dummyyy.jpg",
    };
    const response = await request(app).post("/users").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("New user created");
  });
});
