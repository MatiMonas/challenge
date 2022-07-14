//@ts-nocheck
import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;

export function generateAccessToken(email: string) {
  return jwt.sign({ email }, TOKEN_SECRET, { expiresIn: '1h' });
}
