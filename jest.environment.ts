import NodeEnvironment from 'jest-environment-node';
import Knex from 'knex';
import knexConfig from './src/infrastructure/config/knexfile';
import { Model } from 'objection';

class CustomTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__KNEX__ = Knex(knexConfig);
    Model.knex((this.global.__KNEX__ as any));
  }

  async teardown() {
    await (this.global.__KNEX__ as any).destroy();

    await super.teardown();
  }
}

module.exports = CustomTestEnvironment;
