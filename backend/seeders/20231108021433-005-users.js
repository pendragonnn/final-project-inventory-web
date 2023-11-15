"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        id: "U-0001",
        role_id: "1",
        full_name: "Deddy Coral",
        email: "uhuy@gmail.com",
        password: "deddy123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "U-0002",
        role_id: "2",
        full_name: "Alana Cho",
        email: "uhuy@gmail.com",
        password: "alana123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "U-0003",
        role_id: "3",
        full_name: "Diandra Hakim",
        email: "uhuy@gmail.com",
        password: "diandra123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
