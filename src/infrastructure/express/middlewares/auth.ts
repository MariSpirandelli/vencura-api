import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { Credential, AuthInfo } from '../../../types/authRequest';

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
      const { address, chain, id, public_identifier, wallet_name, wallet_provider, format, email } = credential;

      verifiedCredentials.push({
        address,
        chain,
        userId: id,
        publicIdentifier: public_identifier,
        walletName: wallet_name,
        walletProvider: wallet_provider,
        format,
        email,
      });
    }

    const authInfo: AuthInfo = {
      verifiedCredentials,
      email,
      isNewUser: new_user,
      environmentId: environment_id,
    };

    (req as any).authInfo = authInfo;
    next();
  });
}
