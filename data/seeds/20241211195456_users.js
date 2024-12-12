const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()

  const users = [];

  for (let i = 0; i < 100; i++) {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      created_at: faker.date.anytime(),
      updated_at: faker.date.anytime(),
    };

    users.push(user);
  }
  await knex('users').insert(users);
};
