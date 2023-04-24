import { NextFunction, Response, Request } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncHandler = (fn: (...params: any[]) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};