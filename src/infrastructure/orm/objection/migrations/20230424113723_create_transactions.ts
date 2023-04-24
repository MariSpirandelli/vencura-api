import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').unsigned().primary();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at');

    table.string('idempotency_key').unique().notNullable();
    table.integer('from_user_wallet_id').references('id').inTable('user_wallets').notNullable();
    table.integer('to_user_wallet_id').references('id').inTable('user_wallets');
    table.string('to_wallet_address').notNullable();
    table.string('amount').notNullable();
    table.enum('status', ['COMPLETE', 'IN_PROCESS', 'FAILED']).defaultTo('COMPLETE');
    table.string('receipt');
    table.string('fail_reason');
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('transactions');
}
