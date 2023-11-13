"use strict"

const { sequelize } = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransactionHeaders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      outlet_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Outlets",
          },
          key: "id",
        },
      },
      item_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Items",
          },
          key: "id",
        },
      },
      supplier_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Suppliers",
          },
          key: "id",
        },
      },
      information: {
        type: Sequelize.STRING,
      },
      transaction_date: {
        type: Sequelize.DATE,
      },
      total_amount: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TransactionHeaders")
  },
}
