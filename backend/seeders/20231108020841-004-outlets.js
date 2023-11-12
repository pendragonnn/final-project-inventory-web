'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Outlets', [
      {
        id: 'O-0001',
        name: 'Toko Sepatu Kita',
        address: 'Jalan Pegangsaan no 28',
        phone: '0218543634',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'O-0002',
        name: 'Toko Sepatu Pasar Baru',
        address: 'Jalan Pasar Baru no 8',
        phone: '0218832411',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'O-0003',
        name: 'Toko Sepatuku',
        address: 'Jalan Bagus no 2',
        phone: '0814432558',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Outlets', null, {})
  }
};
