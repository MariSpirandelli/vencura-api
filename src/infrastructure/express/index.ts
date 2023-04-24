import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import mung from 'express-mung';
import routes from '../../routes';
import errorHandler from './middlewares/errorHandler';
import requestLogger from './middlewares/requestLogger';
import auth from './middlewares/auth';
import bunyan from 'bunyan';
import userController from '../../core/user';
import { AuthRequest } from '../../types/authRequest';
import IUserController from '../../core/interfaces/iUser';
import securityCheck from './middlewares/securityCheck';

const logger = bunyan.createLogger({ name: 'express::api' });

const createServer = () => {
  const app = express();
  app.enable('trust proxy');

  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );
  app.use(express.json());
  app.use(mung.json(securityCheck));
  app.use(helmet());
  app.use(requestLogger());

  app.get('/status', (_, res) => {
    res.status(200).json({ status: 'up' });
  });

  app.post('/login', auth, async (req: Request, res: Response) => {
    const externalInfo = (req as AuthRequest).authInfo;
    const userControl: IUserController = userController;
    const { verifiedCredentials, isNewUser } = externalInfo;

    let user;
    if (isNewUser) {
      user = await userControl.create(externalInfo);
    } else {
      user = await Promise.all([
        userControl.getByExternalUserId(verifiedCredentials[0].userId),
        userControl.updateCredentials(externalInfo),
      ]);
    }

    logger.info('[login] User logged in', { ipAddress: req.ip, referrer: req.get('Referrer'), user });

    return res.sendStatus(200);
  });

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
};

export default createServer;
