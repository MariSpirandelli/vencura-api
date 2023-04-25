import bunyan from 'bunyan';
import { Response, Router } from 'express';
import auth from '../infrastructure/express/middlewares/auth';
import { asyncHandler } from '../infrastructure/express/middlewares/asyncHandler';
import walletController from '../core/wallet';
import { AuthRequest } from '../types/authRequest';
import userController from '../core/user';
import { BadRequestError, InternalError } from '../infrastructure/express/errors';
import transactionController from '../core/transaction';

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

router.post(
  '/sign',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const authInfo = req.authInfo;

    const user = await userController.getByExternalUserId(authInfo.verifiedCredentials[0].userId);
    if (!user) {
      throw new BadRequestError('User not logged');
    }

    const { message } = req.body;

    if (!message) {
      throw new BadRequestError('Content to sign is mandatory');
    }

    try {
      res.status(200).json(await walletController.signUserMessage(user.id, message));
    } catch (error) {
      logger.error(`[get] Error while signing message from user: `, error);
      throw new InternalError('Could not sign message. Try again later');
    }
  }),
);

router.post(
  '/transaction',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const authInfo = req.authInfo;

    const user = await userController.getByExternalUserId(authInfo.verifiedCredentials[0].userId);
    if (!user) {
      throw new BadRequestError('User not logged');
    }

    const { idempotencyKey, fromUserWalletId, toWalletAddress, amount } = req.body;

    if (!amount || !toWalletAddress) {
      throw new BadRequestError('Missing parameters');
    }

    try {
      res.status(200).json(
        await transactionController.request({
          idempotencyKey,
          fromUserWalletId,
          toWalletAddress,
          amount,
        }),
      );
    } catch (error) {
      logger.error(`[get] Error while signing message from user: `, error);
      throw new InternalError('Could not sign message. Try again later');
    }
  }),
);

export = router;
