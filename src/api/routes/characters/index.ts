import { Router } from 'express';
import { getCharactersController } from '../../controllers/characters'
const router = Router()

    /**
   * @openapi
   * /characters:
   *   get:
   *     summary: Get all characters
   *     tags:
   *       - Character Routes
   *     responses:
   *       200:
   *         description: Return an array of characters with their id, name and image.
   *         content: {}
   */
  .get('/', getCharactersController)
    /**
   * @openapi
   * /characters:
   *    post:
   *     summary: Creates a new character
   *     tags:
   *       - Character Routes
   *    requestBody:
   *     content:
   *      application/json:
   *       schema:
   *       type: object
   *      properties:
   *      name:
   *      type: string
   *     description:
   *    required:
   *    - name
   *    responses:
   *      200:
   *       description: Return
   *      content: {}
   */




export default router;