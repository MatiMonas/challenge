import { Router, Request, Response, Next } from 'express';
import characterRoutes from './characters';
import testRoutes from './test';

const router = Router();


/**
   * @openapi
   * tags:
   *   - name: Test Routes
   *     description: Testing routes to check that everything works fine.
   *   - name: Character Routes
   *     description: Routes to manage characters
   */
router.use('/characters', characterRoutes)
router.get('/test', testRoutes)

export default router;
