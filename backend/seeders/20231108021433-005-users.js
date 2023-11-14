<<<<<<< HEAD
"use strict";
=======
"use strict"
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        id: "U-0001",
<<<<<<< HEAD
        role_id: "R-0001",
        full_name: "Deddy Coral",
        username: "deddy_admin",
        email: "deddy@mail.com",
=======
        role_id: "1",
        full_name: "Deddy Coral",
        username: "deddy_admin",
        email: "uhuy@gmail.com",
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba
        password: "deddy123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "U-0002",
<<<<<<< HEAD
        role_id: "R-0002",
        full_name: "Alana Cho",
        username: "alana_staff",
        email: "alana@mail.com",
=======
        role_id: "2",
        full_name: "Alana Cho",
        username: "alana_staff",
        email: "uhuy@gmail.com",
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba
        password: "alana123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "U-0003",
<<<<<<< HEAD
        role_id: "R-0003",
        full_name: "Diandra Hakim",
        username: "diandra_manager",
        email: "diandra@mail.com",
=======
        role_id: "3",
        full_name: "Diandra Hakim",
        username: "diandra_manager",
        email: "uhuy@gmail.com",
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba
        password: "diandra123",
        image_url: "dummy.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
<<<<<<< HEAD
    return queryInterface.bulkDelete("Users", null, {});
  },
};
=======
    return queryInterface.bulkDelete("Users", null, {})
  },
}
>>>>>>> eb0ecc442ec1c51bb6e727ba823f72269f9ecdba
