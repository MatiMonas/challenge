import { NextFunction, Request, Response } from 'express';
import db from '../../db';

const { Character } = db;

export async function getCharactersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.send([
      {
        id: 1,
        name: 'Mickey',
        image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
        age: 15,
        weight: 40,
      },
      {
        id: 2,
        name: 'Donald',
        image:
          'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
        age: 16,
        weight: 30,
      },
    ]);
  } catch (err) {
    next(err);
  }
}

export async function createCharacterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await Character.create(req.body);
  } catch (err) {
    next(err);
  }
}

export async function deleteCharacterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function patchCharacterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (err) {
    next(err);
  }
}
