//@ts-nocheck

import jwt from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;

export function generateAccessToken(email: string) {
  return jwt.sign({ email }, TOKEN_SECRET, { expiresIn: '1000h' });
}
