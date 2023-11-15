"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("TransactionHeaders", [
      {
        id: "TH-0001",
        user_id: "U-0002",
        outlet_id: "O-0001",
        item_id: "I-0001",
        unit_price: 10000000,
        quantity: 10,
        information: "Issuing",
        transaction_date: new Date(),
        total_amount: 10000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "TH-0002",
        user_id: "U-0002",
        supplier_id: "S-0001",
        item_id: "I-0002",
        unit_price: 10000000,
        quantity: 10,
        information: "Recieving",
        transaction_date: new Date(),
        total_amount: 10000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "TH-0003",
        user_id: "U-0002",
        outlet_id: "O-0002",
        item_id: "I-0003",
        unit_price: 10000000,
        quantity: 10,
        information: "Issuing",
        transaction_date: new Date(),
        total_amount: 8000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("TransactionHeaders", null, {})
  },
}
