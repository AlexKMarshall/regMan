'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'instruments',
      [
        {
          name: 'Fiddle',
          max_attendants: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Cello',
          max_attendants: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Guitar',
          max_attendants: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Flute',
          max_attendants: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Fiddle Beginner',
          max_attendants: 13,
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
