'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Roles'
          },
          key:'id'
        }
      },
      full_name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
<<<<<<< HEAD
=======
      email: {
        type: Sequelize.STRING
      },
>>>>>>> 546562d79de5dbd8e8fdd885cbb63056eaa85c07
      password: {
        type: Sequelize.STRING
      },
      image_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};