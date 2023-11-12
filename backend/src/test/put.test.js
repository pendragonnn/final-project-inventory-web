const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("PUT /users/:id", () => {
  it("should update a user with a valid id", async () => {
    const userData = {
      id: "U-74",
      role_id: "R-0001",
      full_name: "Coral ungu",
      username: "deddy_adm",
      password: "deddy12",
      image_url: "dummyyy.jpg",
      createdAt: "2023-11-09T02:53:14.791Z",
      updatedAt: "2023-11-09T02:53:14.791Z",
    };
    const response = await request(app).put("/users/U-74").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(" user update succesfully ");
  });

  it("should return 500 for an invalid id", async () => {
    const response = await request(app).put("/users/9999").send({});
    expect(response.status).toBe(404);
  });
});
