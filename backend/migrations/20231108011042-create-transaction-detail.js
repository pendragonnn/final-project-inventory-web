"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransactionDetails", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      header_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "TransactionHeaders",
          },
          key: "id",
        },
        onDelete: "cascade",
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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price_item: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("TransactionDetails")
  },
}
