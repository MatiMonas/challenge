import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../../db';

const { Character, Movie } = db;

interface IMoviesWhere {
  title?: { [Op.iLike]: string };
  genreId?: number;
}

export async function movieGetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let { id, genre } = req.query;
    let parsedId: number | undefined;
    let parsedGenreId: number | undefined;
    let title: string | undefined;
    let orderBy: string | undefined;

    parsedId = Number(id);
    parsedGenreId = Number(genre);
    title = req.query.title as string;
    orderBy = req.query.order as string;

    const where: IMoviesWhere = {};

    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (genre) where.genreId = parsedGenreId;

    if (!id) {
      const querySearch = {
        where,
        attributes: ['id', 'title', 'image', 'releaseDate'],
        order: /^(asc|desc)$/i.test(orderBy) ? [['rating', orderBy]] : [],
      };

      const movies = await Movie.findAll(querySearch);

      if (!movies.length) {
        return res.status(404).json({
          message: 'movie/s not found',
        });
      }
      return res.status(200).json(movies);
    }

    if (isNaN(parsedId)) {
      return res.status(400).json({
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
    let title: string | undefined;
    let releaseDate: string | undefined;
    let image: string | undefined;
    let rating: number | undefined;
    let genreId: number | undefined;

    title = req.body.title;
    releaseDate = req.body.releaseDate;
    image = req.body.image;
    rating = Number(req.body.rating);
    genreId = Number(req.body.genreId);

    if (!title || !releaseDate) {
      return res.status(400).json({
        message: 'missing required parameters',
      });
    }

    if (isNaN(genreId) || isNaN(rating)) {
      return res.status(400).json({
        message: 'rating and genreId must be an integer number',
      });
    }

    const [movie, created] = await Movie.findOrCreate({
      where: { title },
      defaults: { releaseDate, rating, image },
    });

    if (!created) {
      return res.status(409).json({
        message: 'movie already exists',
      });
    }

    let genre = await db.Genre.findByPk(genreId);

    if(!genre) {
      return res.status(404).json({
        message: 'genre not found',
      });
    }

    await movie.setGenre(genre);

    return res.status(201).json({ message: 'movie created' });
  } catch (err) {
    console.log(err);

    next(err);
  }
}

export async function deleteMovieController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.query;
    let parsedId: number | undefined;

    parsedId = Number(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        message: 'id is required and must be an integer number',
      });
    }

    const movie = await Movie.findByPk(parsedId);

    if (!movie) {
      return res.status(404).json({
        message: 'movie not found',
      });
    }

    await movie.destroy();

    return res.status(200).json({ message: 'movie deleted successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function patchMovieController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.query;

    let parsedId: number | undefined;
    let parsedRating: number | undefined;
    let image: string | undefined;
    let rating: number | undefined;

    rating = req.body.rating;
    parsedRating = Number(rating);
    parsedId = Number(id);
    image = req.body.image;

    if (isNaN(parsedId)) {
      return res.status(400).json({
        message: 'id is required and it must be an integer number',
      });
    }

    if (!rating && !image) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

    if (isNaN(parsedRating)) {
      return res.status(400).json({
        message: 'rating must be an integer number',
      });
    }

    const movie = await Movie.findByPk(parsedId);

    if (!movie) {
      return res.status(404).json({
        message: 'movie not found',
      });
    }

    if (parsedRating) movie.rating = parsedRating;
    if (image) movie.image = image;

    await movie.save();

    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
}
