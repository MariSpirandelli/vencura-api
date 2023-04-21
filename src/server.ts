import createServer from './infrastructure/express/index';
import bunyan from 'bunyan';
import config from './infrastructure/config';
import { DBConnection } from './infrastructure/orm';
import ObjectionORM from './infrastructure/orm/objection';

const logger = bunyan.createLogger({ name: 'server' });

const dbConnection = new DBConnection<ObjectionORM>(new ObjectionORM());

process.on('uncaughtException', (err) => {
  logger.error('[UncaughtException] SERVER ERROR:', err);

  // prevent undefined state of the application
  process.exit(-500);
});

process.on('unhandledRejection', (err: any, promise) =>
  logger.error('[UnhandledRejection]', err.message, '\n', err, promise)
);

const exitSignalHandler = (arg: any) => {
  logger.info('Exit code received', arg);
  dbConnection.disconnect();
};
process.on('SIGINT', exitSignalHandler);
process.on('SIGUSR1', exitSignalHandler);
process.on('SIGUSR2', exitSignalHandler);

logger.info('[STARTING] Server process at UTC:', new Date());

dbConnection.connect(config.knex.seeds.run).then(() => {
  const app = createServer();

  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}/`);
  });
});
