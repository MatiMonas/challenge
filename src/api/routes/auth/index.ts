import { Router } from 'express';
import { authLoginController, authRegisterController } from '../../controllers/auth';

const router = Router()
  /**
   * @openapi
   * /register:
   *   post:
   *     summary: Creates a new user
   *     tags:
   *       - Auth Routes
   *     parameters:
   *       - in: body
   *         name:
   *          user
   *         description: User object
   *         schema:
   *          type: object
   *          required:
   *            - email
   *            - password
   *          properties:
   *            email:
   *              type: string
   *              example: usuarioNuevo@gmail.com
   *              required: true
   *            password:
   *              type: string
   *              example: contraseñaDificil
   *              required: true
   *     responses:
   *       201:
   *         description: Created
   */
   .post('/register', authRegisterController)
  /**
   * @openapi
   * /login:
   *   post:
   *     summary: Login for the user
   *     tags:
   *       - Auth Routes
   *     parameters:
   *       - in: body
   *         name:
   *          user
   *         description: User object
   *         schema:
   *          type: object
   *          required:
   *            - email
   *            - password
   *          properties:
   *            email:
   *              type: string
   *              example: usuarioNuevo@gmail.com
   *              required: true
   *            password:
   *              type: string
   *              example: contraseñaDificil
   *              required: true
   *     responses:
   *       200:
   *         description: Created
   */
   .post('/login', authLoginController)
export default router;