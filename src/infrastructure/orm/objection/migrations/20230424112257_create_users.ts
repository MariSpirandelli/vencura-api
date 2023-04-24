import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at');

    table.string('name');
    table.string('email').nullable().unique();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('users');
}

