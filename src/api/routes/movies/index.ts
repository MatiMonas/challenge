import { Router } from 'express';
import {
  movieCreatorController,
  movieGetController,
  deleteMovieController,
  patchMovieController,
} from '../../controllers/movies';
import { checkJWT } from '../../middlewares';

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
   *         description: Orders movies by rating. ASC or DESC.
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
   *       - in: header
   *         name: Authorization
   *         description: Bearer token you got from login.
   *         required: true
   *         schema:
   *         type: string 
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
  .post('/', checkJWT, movieCreatorController)
  /**
   * @openapi
   * /movies:
   *   delete:
   *    summary: Deletes a movie
   *    tags:
   *      - Movies Routes
   *    parameters:
   *      - in: header
   *        name: Authorization
   *        description: Bearer token you got from login.
   *        required: true
   *        schema:
   *        type: string 
   *      - in: query
   *        name: id
   *        description: Movie id
   *        required: true
   *        schema:
   *          type: number
   *    responses:
   *      200:
   *        description: Deleted
   *        content: {}
   */
  .delete('/', checkJWT, deleteMovieController)

  /**
   * @openapi
   * /movies:
   *    patch:
   *     summary: Updates movies properties
   *     tags:
   *       - Movies Routes
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         description: Bearer token you got from login.
   *         required: true
   *         schema:
   *         type: string 
   *       - in: query
   *         name: id
   *         description: Movie id
   *         required: true
   *         schema:
   *          type: number
   *       - in: body
   *         name: character
   *         description: Character object
   *         schema:
   *          type: object
   *          properties:
   *            raing:
   *              required: false
   *              type: number
   *              example: 5
   *            image:
   *              required: false
   *              type: string
   *              example: https://pics.filmaffinity.com/Mulan-247098384-large.jpg
   *    responses:
   *      204:
   *        description: Endopoint to update a character
   *        content: {}
   */
  .patch('/', checkJWT, patchMovieController);

export default router;
