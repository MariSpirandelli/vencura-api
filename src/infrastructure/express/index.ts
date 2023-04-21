import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
// import routes from '../../routes';
import errorHandler from './middlewares/errorHandler';
import requestLogger from './middlewares/requestLogger';

const createServer = () => {
  const app = express();
  app.enable('trust proxy');

  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
  app.use(express.json());

  app.use(helmet());
  app.use(requestLogger());

  app.get('/status', (_, res) => {
    res.status(200).json({ status: 'up' });
  });

  // app.use('/api', routes);

  app.use(errorHandler);

  return app;
};

export default createServer;
