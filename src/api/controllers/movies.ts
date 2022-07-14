import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { movie } from '../../common/interfaces';
import db from '../../db';

const { Character, Movie, Genre } = db;

interface IMoviesWhere {
  title?: {[Op.iLike]: string};
  genreId?: string;
}

interface IMoviesOrder{
  order?: string
}

export async function movieGetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id, title, genre, orderBy } = req.query;
    id = parseInt(id) as number;
    genre  = parseInt(genre) as number;
    orderBy = orderBy as string;

    const where: IMoviesWhere = {};
    

    if (title) where.title =  {[Op.iLike]: `%${title}%`};
    if (genre) where.genreId = genre;

    if (!id) {
      const querySearch ={
        where,
        attributes: ['id', 'title', 'image', 'releaseDate'],
        order: orderBy ? [['rating',orderBy]] : [],
      }
      
      const movies = await Movie.findAll(querySearch);

      if (!movies.length) {
        return res.status(404).send({
          message: 'movie/s not found',
        });
      }
      return res.status(200).json(movies);
    }

    if (isNaN(id)) {
      return res.status(400).send({
        message: 'id must be a number',
      });
    }

    const movie = await Movie.findByPk(id, {
      include: [
        {
          model: Character,
          as: 'characters',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(movie);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function movieCreatorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { title, releaseDate, rating, image, genreId } = req.body;
    genreId = parseInt(genreId);

    if (!title || !releaseDate || !genreId) {
      return res.status(400).send({
        message: 'Missing required parameters',
      });
    }

    const movie = await Movie.create({ title, releaseDate, rating, image });

    await movie.setGenre(genreId);

    return res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
}
