import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;

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
    const authorizationToken: string = req.headers['authorization'] || '';

    if (!authorizationToken) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    //@ts-ignore
    let decodedToken = jwt.verify(authorizationToken, TOKEN_SECRET);

    //@ts-ignore
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: 'invalid token',
    });
  }
}
