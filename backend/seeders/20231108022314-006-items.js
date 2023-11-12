'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Items', [
      {
        id: 'I-0001',
        name: 'Nike Air Jordan',
        description: 'Hype and cool basketball shoes',
        category_id: 'C-0001',
        price: 1000000,
        stock: 100,
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'I-0002',
        name: 'Vans Oldskool',
        description: 'Simple and casual shoes',
        category_id: 'C-0002',
        price: 2000000,
        stock: 300,
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'I-0003',
        name: 'Nike Air Force 1',
        description: 'Hype and cool basketball shoes',
        category_id: 'C-0001',
        price: 3000000,
        stock: 10,
        image_url: 'dummy.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Items', null, {});
  }
};
