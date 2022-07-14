import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

export function generateAccessToken(email: string) {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

export function checkJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { authorization } = req.headers;
    let token = authorization.split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({
      message: 'invalid token',
    });
  }
}
