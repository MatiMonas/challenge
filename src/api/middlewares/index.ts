import { NextFunction, Request, Response } from 'express';


export const errorHandler = (
  err: any,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status || 500;
  const errors =
    err.errors && err.errors.length ? err.errors : [{ message: err.message }];
  if (status >= 500) {
    console.error(err);
  } else {
    console.info({ status, errors });
  }
  res.status(status).json({ errors });
};
