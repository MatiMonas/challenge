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
    orderBy = req.query.orderBy as string;

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
        return res.status(404).send({
          message: 'movie/s not found',
        });
      }
      return res.status(200).json(movies);
    }

    if (isNaN(parsedId)) {
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

    if (!title || !releaseDate || !genreId) {
      return res.status(400).send({
        message: 'Missing required parameters',
      });
    }

    if (isNaN(genreId) || isNaN(rating)) {
      return res.status(400).json({
        message: 'rating and genreId must be an integer number',
      });
    }

    const movie = await Movie.create({ title, releaseDate, rating, image });

    await movie.setGenre(genreId);

    return res.status(201).json({ message: 'Movie created' });
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

    if (!parsedId) {
      return res.status(400).send({
        message: 'missing required parameters',
      });
    }

    if (isNaN(parsedId)) {
      return res.status(400).send({
        message: 'id must be an integer number',
      });
    }

    const movie = await Movie.findByPk(parsedId);

    if (!movie) {
      return res.status(404).send({
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
    const { id, rating } = req.query;

    let parsedId: number | undefined;
    let parsedRating: number | undefined;
    let image: string | undefined;

    parsedId = Number(id);
    parsedRating = Number(rating);
    image = req.body.image;

    if (!parsedId) {
      return res.status(400).send({
        message: 'missing id',
      });
    }

    if (isNaN(parsedId) || isNaN(parsedRating)) {
      return res.status(400).send({
        message: 'id and rating must be integers',
      });
    }

    if (!rating && !image) {
      return res.status(400).json({ message: 'missing required parameters' });
    }

    const movie = await Movie.findByPk(parsedId);

    if (!movie) {
      return res.status(404).send({
        message: 'movie not found',
      });
    }

    if (rating) movie.rating = rating;
    if (image) movie.image = image;

    await movie.save();

    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
}
