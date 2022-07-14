import { Router} from 'express';
import testRoutes from '../routes/testRoutes';
import authRoutes from '../routes/auth';
import characterRoutes from '../routes/characters';
import moviesRoutes from '../routes/movies';

const router = Router()
/**
   * @openapi
   * tags:
   *   - name: Test Routes
   *     description: Testing routes to check that everything works fine.
   *   - name: Character Routes
   *     description: Routes to manage characters, CRUD
   *   - name: Movies Routes
   *     description: Routes to manage movies, CRUD
   */
  .use('/test', testRoutes)
  .use('/auth', authRoutes)
  .use('/characters', characterRoutes)
  .use('/movies', moviesRoutes)
export default router;
