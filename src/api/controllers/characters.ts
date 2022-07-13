import { NextFunction, Request, Response } from 'express';

export async function getCharactersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.send([
      {
        id: 1,
        name: 'Mickey Mouse',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mickey_Mouse_%28cropped%29.jpg/220px-Mickey_Mouse_%28cropped%29.jpg',
      },
    ]);
  } catch (err) {
    next(err);
  }
}
