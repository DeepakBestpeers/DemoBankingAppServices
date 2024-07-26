/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("accounts", function (table) {
      table.increments("id").comment("primary key");
      table
      .integer("userId", 10)
      .unsigned()
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE")
      .comment("FK->users.id");
      table.decimal('balance', 15, 2).defaultTo(0);
      table.dateTime("createdAt").notNullable();
      table.dateTime("updatedAt").nullable();
    });
};
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function (knex) {
    return knex.schema.dropTable("accounts");
};