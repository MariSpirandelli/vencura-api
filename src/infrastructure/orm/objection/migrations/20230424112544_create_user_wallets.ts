import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('user_wallets', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at');
    
    table.integer('user_id').references('id').inTable('users');
    table.string('private_key').unique().notNullable();
    table.enum('chain', ['ETHER']).defaultTo('ETHER');
    table.string('address').notNullable().unique();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('user_wallets');
}
