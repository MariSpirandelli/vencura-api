import bunyan from 'bunyan';
import Knex from 'knex';
import { Model } from 'objection';
import { ORM } from '../index';

import config from '../../config';

export const dbLogger = bunyan.createLogger({ name: 'db' });

export default class ObjectionORM implements ORM {
  knexConnection: any;

  constructor() {
    this.knexConnection = Knex(config.knex);
  }

  async connect(runSeed: boolean = false) {
    Model.knex(this.knexConnection);

    dbLogger.info('Running knex migrations...');
    await this.knexConnection.migrate.latest();
    dbLogger.info('Done running knex migrations.');

    if (!runSeed) {
      return;
    }

    dbLogger.info('Running knex seeds...');
    await this.knexConnection.seed.run(config.knex.seeds);
    dbLogger.info('Done running knex seeds.');
  }

  async disconnect() {
    return this.knexConnection?.destroy();
  }
}
