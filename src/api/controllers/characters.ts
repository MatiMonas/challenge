import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { Op } from 'sequelize';

const { Character, Movie } = db;

interface ICharacterWhere {
  name?: { [Op.iLike]: string };
  age?: number;
  movies?: number[];
}

interface IUpdateObject {
  age?: number;
  weight?: number;
  history?: string;
  image?: string;
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
      parseInt(ids) ? Number(parseInt(ids)) : false,
    );

    age = Number(age).toFixed(0);
    weight = Number(weight).toFixed(0);

    if (!name || !age || !weight || !moviesIds[0]) {
      return res.status(400).send('Missing required parameters');
    }

    if (isNaN(age) || isNaN(weight)) {
      return res.status(400).json({
        message: 'age and weight must be an integer number',
      });
    }

    if (moviesIds.indexOf(false) !== -1) {
      return res.status(400).json({
        message: 'movies must be an array of integer numbers',
      });
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
        console.log(err);

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
    let { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

    if (!/^[0-9]*$/.test(id)) {
      return res.status(400).json({
        message: 'id must be an integer number',
      });
    }

    id = parseInt(id);

    const character = await Character.findByPk(id);

    if (!character) {
      return res.status(404).json({
        message: 'character not found',
      });
    }

    await character.destroy();
    return res.status(200).json({ message: 'character deleted successfully' });
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
    const { age, weight, history, image, movies } = req.body;
    let { id } = req.query;

    let moviesIds = movies?.map((ids: string) =>
      parseInt(ids) ? parseInt(ids) : false,
    );
    if (!id) {
      return res.status(400).json({ message: 'missing id' });
    }
    if (!/^[0-9]*$/.test(id)) {
      return res.status(400).json({
        message: 'id must be an integer number',
      });
    }

    if (!age && !weight && !moviesIds?.length && !history && !image) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

    id = parseInt(id);

    const character = await Character.findByPk(id);

    if (!character) {
      return res.status(404).json({
        message: 'character not found',
      });
    }

    let updateObject: IUpdateObject = {};
    age && (updateObject.age = age);
    weight && (updateObject.weight = weight);
    history && (updateObject.history = history);
    image && (updateObject.image = image);

    moviesIds && character.addMovies(moviesIds);
    await character.update(updateObject, { where: { id } });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
