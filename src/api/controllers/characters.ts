import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { character } from '../../common/interfaces';

const { Character } = db;

export async function getCharactersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id } = req.query;
    let charactersToSend: character[] = [];

    id = parseInt(id);
    console.log(id);

    const condition: { where?: { id?: number }; raw: boolean } = { raw: true };
    const where: { id?: number } = {};

    if (id) where.id = id;

    condition.where = where;

    const characters = await Character.findAll(condition);
    
    if (!characters.length) {
      return res.status(404).send({
        message: 'Character/s not found',
      });
    }

    if (!isNaN(id)) {
      charactersToSend = characters[0];
    } else {
      charactersToSend = characters.map((character: character) => {
        return {
          id: character.id,
          name: character.name,
          image: character.image,
        };
      });
    }

    return res.status(200).json(charactersToSend);
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
    const { name, age, weight } = req.body;

    if (!name || !age || !weight) {
      return res.status(400).send('Missing required parameters');
    }

    const { dataValues: character } = await Character.create(req.body);

    console.log(character);
    return res.status(201).json(character);
  } catch (err) {
    next(err);
    return res
      .status(500)
      .json({ msg: 'Error creating character', error: err?.message });
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
