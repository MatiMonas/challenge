//@ts-nocheck
import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;


export function generateAccessToken(email: string) {
  return jwt.sign({ email }, TOKEN_SECRET, { expiresIn: '1h' });
}

export function checkJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    let token: string = authorization.split(' ')[1];
    let decodedToken = jwt.verify(token, TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'invalid token',
    });
  }
}
