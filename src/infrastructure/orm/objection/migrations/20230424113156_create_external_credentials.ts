import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('external_credentials', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at');

    table.integer('user_id').references('id').inTable('users').notNullable();
    table.string('external_user_id').unique().notNullable();
    table.enum('format', ['blockchain', 'email']).defaultTo('blockchain');
    table.string('value').notNullable().unique();
    table.string('chain');
    table.enum('origin', ['DYNAMIC']).defaultTo('DYNAMIC');
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('external_credentials');
}
