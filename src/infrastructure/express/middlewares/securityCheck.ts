import { Request } from 'express';
import { AuthRequest } from '../../../types/authRequest';

const privateProps = ['privateKey', 'email'];

const objectCheck = (body: any, req: Request) => {
  privateProps.map((prop) => {
    if (
      body.hasOwnProperty(prop) &&
      prop === 'email' &&
      (req as AuthRequest).authInfo?.email !== undefined &&
      body[prop] === (req as AuthRequest).authInfo?.email
    ) {
      return;
    }

    if (body.hasOwnProperty(prop)) {
      delete body[prop];
    }
  });

  Object.keys(body).map((key) => {
    if (body[key] && typeof body[key] === 'object') {
      return objectCheck(body[key], req);
    }
  });
};

const securityCheck = (body: any, req: Request) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  objectCheck(body, req);

  return body;
};

export default securityCheck;
