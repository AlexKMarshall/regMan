'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'instruments',
      [
        {
          name: 'Guitar',
          max_attendants: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Violin',
          max_attendants: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('instruments', null, {});
  },
};
