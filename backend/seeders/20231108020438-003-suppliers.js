"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Suppliers", [
      {
        id: "S-0001",
        name: "PT. MAP Indonesia",
        address: "Jalan Kebagusan no 28",
        phone: "021889128",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "S-0002",
        name: "PT. Jaya Abadi",
        address: "Jalan Ketapang no 28",
        phone: "0218832411",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "S-0003",
        name: "PT. Cahaya Suka",
        address: "Jalan Indah no 28",
        phone: "0814445008",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};
