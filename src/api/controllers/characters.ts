import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { character } from '../../common/interfaces';
import { Op } from 'sequelize';

const { Character, Movie } = db;

interface ICharacterWhere {
  name?: { [Op.iLike]: string };
  age?: number;
  movies?: number[];
}

export async function getCharactersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id, name, age, movies } = req.query;

    id = parseInt(id) as number;
    age = parseInt(age) as number;
    let arrOfMoviesIds = movies && movies.split(',').map(Number);

    const where: ICharacterWhere = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (age) where.age = age;

    if (!id) {
      const querySearch = {
        where,
        attributes: ['id', 'name', 'image'],
        include: arrOfMoviesIds?.length
          ? {
              model: Movie,
              as: 'movies',
              attributes: ['id', 'title'],
              through: { attributes: [] },
              where: {
                id: {
                  [Op.in]: arrOfMoviesIds,
                },
              },
            }
          : [],
      };
      const characters = await Character.findAll(querySearch);

      if (!characters.length) {
        return res.status(404).send({
          message: 'character/s not found',
        });
      }
      return res
        .status(200)
        .json(characters.length > 1 ? characters : characters[0]);
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
    console.log(err);
    next(err);
  }
}

export async function createCharacterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { name, age, weight, history, image, movies } = req.body;

    let moviesIds = movies?.map((ids: string) =>
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
