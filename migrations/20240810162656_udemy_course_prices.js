/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('udemy_course_prices', function (table) {
      table.increments('id').primary();
      table.integer('udemy_course_id').unsigned();
      table.date('date');
      table.double('price');
      table.foreign('udemy_course_id').references('udemy_courses.id')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('udemy_course_prices');
};
