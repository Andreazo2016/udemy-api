/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('udemy_courses', function (table) {
      table.increments('id').primary();
      table.integer('course_id');
      table.string('title', 255);
      table.text('description');
      table.string('url', 255);
      table.string('image', 255);
      table.string('language', 100);
      table.string('language_code', 100);
      table.enum('type', ['paid', 'free']);
      table.double('price');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('udemy_courses');
};
