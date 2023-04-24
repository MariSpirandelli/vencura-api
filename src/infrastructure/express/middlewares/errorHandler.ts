import bunyan from 'bunyan';
import { NextFunction, Response, Request } from 'express';
import { HttpBaseError } from '../errors/base';
import { InternalError } from '../errors/internal';

const logger = bunyan.createLogger({ name: 'ErrorHandler' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const errorOutput = err?.resultOutput ? err?.resultOutput() : err;

  logger.error(`Request error: `, errorOutput);

  if (err instanceof HttpBaseError) {
    res.status(err.code).send(errorOutput);

    return;
  }

  const internalError = new InternalError(err);

  res.status(internalError.code).send(internalError.resultOutput());

  return;
};

export default errorHandler;
