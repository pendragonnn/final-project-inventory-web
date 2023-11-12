'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        id: 'C-0001',
        name: 'Sport',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'C-0002',
        name: 'Casual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'C-0003',
        name: 'Heels',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
