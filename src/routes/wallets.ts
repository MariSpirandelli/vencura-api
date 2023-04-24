import bunyan from 'bunyan';
import { Response, Router } from 'express';
import auth from '../infrastructure/express/middlewares/auth';
import { asyncHandler } from '../infrastructure/express/middlewares/asyncHandler';
import walletController from '../core/wallet';
import { AuthRequest } from '../types/authRequest';
import userController from '../core/user';
import { BadRequestError, InternalError } from '../infrastructure/express/errors';

const logger = bunyan.createLogger({ name: 'routes::wallet' });

const router = Router();

router.get(
  '/',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const authInfo = req.authInfo;

    const user = await userController.getByExternalUserId(authInfo.verifiedCredentials[0].userId);
    if (!user) {
      throw new BadRequestError('User not logged');
    }

    try {
      const { balance, address, id } = await walletController.getBalanceByUserId(user.id);

      res.status(200).json({ id, balance, address });
    } catch (error) {
      logger.error(`[get] Error while getting balance: `, error);
      throw new InternalError('Could not get balance. Try again later');
    }
  }),
);

export = router;
