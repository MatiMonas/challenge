import { Router } from 'express';
import { checkJWT } from '../../middlewares'
import {
  getCharactersController,
  createCharacterController,
  deleteCharacterController,
  patchCharacterController,
} from '../../controllers/characters';
const router = Router()
  /**
   * @openapi
   * /characters:
   *    get:
   *     summary: Get the detail of a character if a query param is passed, else get all characters
   *     tags:
   *       - Character Routes
   *     parameters:
   *       - in: query
   *         name: id
   *         description: Character id to get the details of a character. Id is not required.
   *         required: false
   *         schema:
   *          type: number
   *       - in: query
   *         name: name
   *         description: Search by character name.
   *         required: false
   *         schema:
   *          type: string
   *       - in: query
   *         name: age
   *         description: Search by character age.
   *         required: false
   *         schema:
   *          type: number
   *       - in: query
   *         name: weight
   *         description: Search by character weight.
   *         required: false
   *         schema:
   *          type: number
   *       - in: query
   *         name: movies
   *         description: Search by multiple movies. Example 'movies=1,2,3,4'
   *         required: false
   *         schema:
   *          type: number
   *     responses:
   *       200:
   *         description: Return an array of characters with their id, name and image.
   *         content: {}
   */
  .get('/',getCharactersController)

  /**
   * @openapi
   * /characters:
   *   post:
   *     summary: Creates a new character
   *     tags:
   *       - Character Routes
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         description: Bearer token you got from login.
   *         required: true
   *         schema:
   *          type: string
   *       - in: body
   *         name:
   *          character
   *         description: Character object
   *         schema:
   *          type: object
   *          required:
   *            - name
   *            - age
   *          properties:
   *            name:
   *              type: string
   *              example: Mickey
   *              required: true
   *            age:
   *              type: number
   *              example: 15
   *              required: true
   *            weight:
   *              type: number
   *              example: 40
   *            image:
   *              type: string
   *              example: https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg
   *            history:
   *             type: string
   *             example: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
   *            movies:
   *             type: array
   *             items:
   *              type: integer
   *              example: 1
   *     responses:
   *       201:
   *         description: Created
   */
  .post('/',checkJWT, createCharacterController)

  /**
   * @openapi
   * /characters:
   *   delete:
   *    summary: Deletes a character
   *    tags:
   *      - Character Routes
   *    parameters:
   *      - in: header
   *        name: Authorization
   *        description: Bearer token you got from login.
   *        required: true
   *        schema:
   *         type: string 
   *      - in: query
   *        name: id
   *        description: Character id
   *        required: true
   *        schema:
   *          type: number
   *    responses:
   *      200:
   *        description: Deleted
   *        content: {}
   */
  .delete('/', checkJWT, deleteCharacterController)

  /**
   * @openapi
   * /characters:
   *    patch:
   *     summary: Updates character properties
   *     tags:
   *       - Character Routes
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         description: Bearer token you got from login.
   *         required: true
   *         schema:
   *         type: string 
   *       - in: query
   *         name: id
   *         description: Character id
   *         required: true
   *         schema:
   *          type: number
   *       - in: body
   *         name: character
   *         description: Character object
   *         schema:
   *          type: object
   *          properties:
   *            age:
   *              required: false
   *              type: number
   *              example: 15
   *            weight:
   *              required: false
   *              type: number
   *              example: 40
   *            image:
   *              required: false
   *              type: string
   *              example: https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg
   *            history:
   *              required: false
   *              type: string
   *              example: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
   *            movies:
   *              required: false
   *              type: array
   *              items:
   *               type: integer
   *               example: 1
   *    responses:
   *      204:
   *        description: Endopoint to update a character
   *        content: {}
   */
  .patch('/', checkJWT, patchCharacterController);

export default router;
