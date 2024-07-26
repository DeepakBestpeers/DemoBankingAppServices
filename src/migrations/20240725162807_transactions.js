/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transactions", function (table) {
      table.increments("id").comment("primary key");
      table
      .integer("accId", 10)
      .unsigned()
      .notNullable()
      .references("accounts.id")
      .onDelete("CASCADE")
      .comment("FK->accounts.id");
      table.enu('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
      table.decimal('amount', 15, 2).notNullable();
      table.decimal('balanceAfter', 15, 2).notNullable();
      table.integer('targetAcc').nullable();
      table.dateTime("createdAt").notNullable();
    });
};
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.down = function (knex) {
    return knex.schema.dropTable("transactions");
};