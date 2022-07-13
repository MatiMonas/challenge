import { Router } from 'express';
import db from '../../db';

const router = Router()

    /**
   * @openapi
   * /characters:
   *   get:
   *     summary: get all characters
   *     tags:
   *       - Characters
   *     responses:
   *       200:
   *         description: Return
   *         content: {}
   */
  .get('/', async (req, res) => {

  })
    /**
   * @openapi
   * /characters:
   *    post:
   *     summary: create a new character
   *     tags:
   *       - Characters
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