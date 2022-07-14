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
    const where: ICharacterWhere = {};
    let parsedId: number | undefined;
    let parsedAge: number | undefined;
    let arrOfMoviesIds: number[] | undefined;

    parsedId = Number(id);
    parsedAge = Number(age);

    arrOfMoviesIds = movies
      ? (movies as string).split(',').map(Number)
      : undefined;

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (age) where.age = parsedAge;

    if (!parsedId) {
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

    if (isNaN(parsedId)) {
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
    let { movies } = req.body;

    let name: string | undefined;
    let age: number | undefined;
    let weight: number | undefined;
    let history: string | undefined;
    let image: string | undefined;
    let arrOfMoviesIds: (number | false)[] | undefined;

    name = req.body.name;
    age = Number(parseInt(req.body.age));
    weight = Number(parseInt(req.body.weight));
    history = req.body.history;
    image = req.body.image;
    arrOfMoviesIds = movies?.map((ids: string) =>
      parseInt(ids) ? Number(parseInt(ids)) : false,
    );

    if (!name || !age || !weight || !(arrOfMoviesIds && arrOfMoviesIds[0])) {
      return res.status(400).send('Missing required parameters');
    }

    if (isNaN(age) || isNaN(weight)) {
      return res.status(400).json({
        message: 'age and weight must be an integer number',
      });
    }

    if (arrOfMoviesIds && arrOfMoviesIds.indexOf(false) !== -1) {
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
      .then((response: typeof Character) => {
        return response.addMovies(arrOfMoviesIds);
      })
      .then(() => {
        return res.status(201).send('character created successfully');
      })
      .catch((err: typeof Error) => {
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
    let parsedId: number | undefined;

    parsedId = Number(id);

    if (!parsedId) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

    if (!/^[0-9]*$/.test(String(parsedId))) {
      return res.status(400).json({
        message: 'id must be an integer number',
      });
    }

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
    let { id } = req.query;

    let parsedId: number | undefined;
    let age: number | undefined;
    let weight: number;
    let history: string;
    let image: string;
    let movies: string[];
    let arrOfMoviesIds: (number | false)[] | undefined;

    parsedId = Number(id);
    age = req.body.age;
    weight = req.body.weight;
    history = req.body.history;
    image = req.body.image;
    movies = req.body.movies;

    arrOfMoviesIds = movies
      ? movies?.map((ids: string) => (parseInt(ids) ? parseInt(ids) : false))
      : undefined;

    if (!parsedId) {
      return res.status(400).json({ message: 'missing id' });
    }
    if (!/^[0-9]*$/.test(String(parsedId))) {
      return res.status(400).json({
        message: 'id must be an integer number',
      });
    }

    if (!age && !weight && !arrOfMoviesIds?.length && !history && !image) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

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

    arrOfMoviesIds && character.addMovies(arrOfMoviesIds);
    await character.update(updateObject, { where: { id } });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
