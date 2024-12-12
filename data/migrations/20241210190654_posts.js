/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('posts', function (table) {
        table.increments('id').primary();
        table.integer('created_by');
        table.foreign('created_by').references('id').inTable('users');
        table.string('title');
        table.text('content');
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('posts');
};
