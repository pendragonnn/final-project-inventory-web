'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        id: 'U-0001',
        role_id: 'R-0001',
        full_name: 'Deddy Coral',
        username: 'deddy_admin',
        password: 'deddy123',
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'U-0002',
        role_id: 'R-0002',
        full_name: 'Alana Cho',
        username: 'alana_staff',
        password: 'alana123',
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'U-0003',
        role_id: 'R-0003',
        full_name: 'Diandra Hakim',
        username: 'diandra_manager',
        password: 'diandra123',
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
