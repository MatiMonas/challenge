import { Router} from 'express';
import characterRoutes from '../routes/characters';
import testRoutes from '../routes/testRoutes';

const router = Router()
/**
   * @openapi
   * tags:
   *   - name: Test Routes
   *     description: Testing routes to check that everything works fine.
   *   - name: Character Routes
   *     description: Routes to manage characters, CRUD
   */
  .use('/test', testRoutes)
  .use('/characters', characterRoutes);
export default router;
