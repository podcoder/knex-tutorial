const { faker } = require('@faker-js/faker');

const getColumnData = async (knex, tableName, columnName) => {
  return new Promise((resolve, reject) => {
    knex(tableName).pluck(columnName).then(async (columnData) => {
      resolve(columnData);
    });
  })
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('posts').del()

  const userIds = await getColumnData(knex, "users", "id");

  const posts = [];
  for (let i = 0; i < 100; i++) {
    const randomUser = Math.floor(Math.random() * userIds.length);
    const randomUserId = userIds[randomUser];

    const post = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(4),
      created_by: randomUserId,
      created_at: faker.date.anytime(),
      updated_at: faker.date.anytime(),
    }
    posts.push(post);
  }

  await knex('posts').insert(posts);
};
