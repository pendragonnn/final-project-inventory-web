const request = require("supertest");
const express = require("express");
const router = require("../routes/index");

const app = express();
app.use(express.json());
app.use(router);

describe("POST /users/upload/:id", () => {
  it("should upload a photo", async () => {
    const response = await request(app)
      .post("/users/upload/U-0003")
      .attach("photo", "C:\\Users\\acer\\Pictures\\naga\\images (16).jpeg");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User photo updated successfully");
  });

  it("should return an error if photo upload fails", async () => {
    const response = await request(app)
      .post("/users/upload/U-0003")
      .attach("photo", "");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No file uploaded");
  });
});
