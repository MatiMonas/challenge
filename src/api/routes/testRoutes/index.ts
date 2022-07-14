import { Router } from 'express';
import { testController } from '../../controllers/testController';

const router = Router()
/**
 * @openapi
 * /test:
 *   get:
 *     tags:
 *       - Test Routes
 *     summary: The hello world endpoint
 *     responses:
 *       200:
 *         description: Return Hello World
 *         content: {}
 */
.get('/', testController);

export default router;
