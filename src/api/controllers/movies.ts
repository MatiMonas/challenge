import { NextFunction, Request, Response } from 'express';
import { movie } from '../../common/interfaces';
import db from '../../db';

const { Character, Movie, Genre } = db;

export async function movieGetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id } = req.query;
    let moviesToSend: movie[] = [];

    id = parseInt(id);

    const condition: { where?: { id?: number }; raw: boolean } = { raw: true };
    const where: { id?: number } = {};

    if (id) where.id = id;

    condition.where = where;

    const movies = await Movie.findAll(condition, {
      include: Character, Genre                          
    });

    if (!movies.length) {
      return res.status(404).send({
        message: 'movie/s not found',
      });
    }

    if (!isNaN(id)) {
      moviesToSend = movies[0];
    } else {
      moviesToSend = movies.map((movie: movie) => {
        return {
          id: movie.id,
          name: movie.title,
          image: movie.image,
          releaseDate: movie.releaseDate,
        };
      });
    }

    return res.status(200).json(moviesToSend);
  } catch (err) {
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
