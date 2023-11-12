'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 'R-0001',
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'R-0002',
        name: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'R-0003',
        name: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
