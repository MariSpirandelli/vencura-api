import { NextFunction, Request, Response } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import config from '../../config';
import bunyan from 'bunyan';
import { Credential, DynamicInfo } from '../../../types/authRequest';

const logger = bunyan.createLogger({ name: 'express::middlewares::auth' });

export default async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!token) {
    return res.status(403).send({
      error: {
        code: 403,
        message: 'User not authenticated',
      },
    });
  }

  jwt.verify(token, config.dynamic.publicToken, { algorithms: ['RS256'] }, function (err, decodedToken) {
    if (err) {
      return res.status(403).send({
        error: {
          code: 403,
          message: 'User not authenticated',
        },
      });
    }

    const { verified_credentials, email, new_user, environment_id } = decodedToken as any;
    let verifiedCredentials: Credential[] = [];
    for (let credential of verified_credentials) {
      const { address, chain, userId, publicIdentifier, walletName, walletProvider, format, email } = credential;

      verifiedCredentials.push({
        address,
        chain,
        userId,
        publicIdentifier,
        walletName,
        walletProvider,
        format,
        email,
      });
    }

    const dynamicInfo: DynamicInfo = {
      verifiedCredentials,
      email,
      isNewUser: new_user,
      environmentId: environment_id,
    };

    (req as any).dynamicInfo = dynamicInfo;
    logger.info(decodedToken);

    next();
  });
}
