import { NextFunction, Request, Response } from 'express';

export function testController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.send('Hello World!');
  } catch (err) {
    next(err);
  }
}
