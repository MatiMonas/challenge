import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { character } from '../../common/interfaces';

const { Character, Movie } = db;

export async function getCharactersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id } = req.query;

    id = parseInt(id);
    if (!id) {
      const characters = await Character.findAll({
        attributes: ['id', 'name', 'image'],
      });

      if (!characters.length) {
        return res.status(404).send({
          message: 'character/s not found',
        });
      }
      return res.status(200).json(characters);
    }

    if (isNaN(id)) {
      return res.status(400).send({
        message: 'id must be a number',
      });
    }

    const character = await Character.findByPk(id, {
      include: [
        {
          model: Movie,
          as: 'movies',
          attributes: ['id', 'title'],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(character);
  } catch (err) {
    next(err);
  }
}

export async function createCharacterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let { name, age, weight, history, image, movieId } = req.body;

  let moviesIds = movieId?.map((ids: string) =>
    parseInt(ids) ? parseInt(ids) : false,
  );
  if (!name || !age || !weight || !moviesIds[0]) {
    return res.status(400).send('Missing required parameters');
  }

  Character.create({
    name,
    age,
    weight,
    history,
    image,
  })
    .then((response: Response) => {
      return response.addMovies(moviesIds);
    })
    .then(() => {
      return res.status(201).send('character created successfully');
    })
    .catch((err) => {
      next(err);
    });
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
