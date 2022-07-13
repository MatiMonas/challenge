import { Router } from 'express';
import { movieCreatorController, movieGetController } from '../../controllers/movies';

const router = Router()
/**
   * @openapi
   * /movies:
   *    get:
   *     summary: Get the detail of a movie/serie if a query param is passed, else get all movies/series
   *     tags:
   *       - Movies Routes
   *     parameters:
   *       - in: query
   *         name: id
   *         description: Movie id to get the details of a character. Id is not required.
   *         required: false
   *         schema:
   *          type: number 
   *     responses:
   *       200:
   *         description: Return an array of characters with their id, name and image.
   *         content: {}
   */
 .get('/', movieGetController)
 
  /**
   * @openapi
   * /movies:
   *   post:
   *     summary: Creates a new movie
   *     tags:
   *       - Movies Routes
   *     parameters:
   *       - in: body
   *         name:
   *          character
   *         description: Movies object
   *         schema:
   *          type: object
   *          required:
   *            - title
   *            - releaseDate
   *          properties:
   *            title:
   *              type: string
   *              example: Mulan
   *              required: true
   *            releaseDate:
   *              type: date
   *              example: 2022-01-17
   *              required: true
   *            image:
   *              type: string
   *              example: https://pics.filmaffinity.com/Mulan-247098384-large.jpg
   *            rating:
   *              type: number
   *              default: 5
   *              example: 5
   *     responses:
   *       201:
   *         description: Created
   */
  .post('/', movieCreatorController);

export default router;
