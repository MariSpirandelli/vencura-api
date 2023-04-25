import bunyan from 'bunyan';
import { Router, Response } from 'express';
import userController from '../core/user';
import { BadRequestError, InternalError } from '../infrastructure/express/errors';
import { asyncHandler } from '../infrastructure/express/middlewares/asyncHandler';
import auth from '../infrastructure/express/middlewares/auth';
import { AuthRequest } from '../types/authRequest';
import transactionController from '../core/transaction';

const logger = bunyan.createLogger({ name: 'routes::transaction' });

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
      res.status(200).json(await transactionController.fetchAll(user.id));
    } catch (error) {
      logger.error(`[get] Error while getting transactions: `, error);
      throw new InternalError('Could not get transactions. Try again later');
    }
  }),
);

export default router;
