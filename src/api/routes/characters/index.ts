import { Router } from 'express';
import {
  getCharactersController,
  createCharacterController,
  deleteCharacterController,
  patchCharacterController
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
   *     responses:
   *       200:
   *         description: Return an array of characters with their id, name and image.
   *         content: {}
   */
  .get('/', getCharactersController)

  /**
   * @openapi
   * /characters:
   *   post:
   *     summary: Creates a new character
   *     tags:
   *       - Character Routes
   *     parameters:
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
  .post('/', createCharacterController)

  /**
   * @openapi
   * /characters/{id}:
   *   delete:
   *    summary: Deletes a character
   *    tags:
   *      - Character Routes
   *    parameters:
   *      - in: path
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
  .delete('/character/:id', deleteCharacterController)
  
  /**
   * @openapi
   * /characters/{id}:
   *   patch:
   *    summary: Updates some propertie of a character
   *    tags:
   *      - Character Routes
   *    parameters:
   *      - in: path
   *        name: id
   *        description: Character id
   *        required: true
   *        schema:
   *          type: number
   *      - in: body
   *        name: character
   *        description: Character object
   *        schema:
   *          type: object
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
   *    description: Endpoint for template deletion
   *    responses:
   *      200:
   *        description: Deleted
   *        content: {}
   */
  .patch('/character/:id', patchCharacterController)

  

export default router;
