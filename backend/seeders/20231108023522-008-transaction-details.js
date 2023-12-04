"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("TransactionDetails", [
      {
        id: "TD-0001",
        header_id: "TH-0001",
        item_id: "I-0001",
        quantity: 10,
        price_item: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "TD-0002",
        header_id: "TH-0002",
        item_id: "I-0001",
        quantity: 20,
        price_item: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "TD-0003",
        header_id: "TH-0003",
        item_id: "I-0002",
        quantity: 30,
        price_item: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("TransactionDetails", null, {})
  },
}
