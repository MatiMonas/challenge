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
   *         description: Movie id to get the details of a movie. .
   *         required: false
   *         schema:
   *          type: number 
   *       - in: query
   *         name: title
   *         description: Search movie by title.
   *         required: false
   *         schema:
   *          type: string 
   *       - in: query
   *         name: genre
   *         description: Search movie by genreId.
   *         required: false
   *         schema:
   *          type: number 
   *       - in: query
   *         name: orderBy
   *         description: Orders movies by rating.
   *         required: false
   *         schema:
   *          type: string 
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
   *          movies
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
   *              type: string
   *              example: 2022-01-17
   *              required: true
   *            image:
   *              type: string
   *              example: https://pics.filmaffinity.com/Mulan-247098384-large.jpg
   *            rating:
   *              type: number
   *              default: 5
   *              example: 5
   *            genreId:
   *              type: number
   *              example: 1
   *              required: true
   *     responses:
   *       201:
   *         description: Created
   */
  .post('/', movieCreatorController);
 
export default router;
