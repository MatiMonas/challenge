import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: any,
  res: Response,
  _next: NextFunction,
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

export function checkJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    let token: string = authorization.split(' ')[1];
    //@ts-ignore
    let decodedToken = jwt.verify(token, TOKEN_SECRET);
    //@ts-ignore
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'invalid token',
    });
  }
}
