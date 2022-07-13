import { Router , Request, Response, Next} from 'express';

const router = Router();

router.get('/test', (req: Request, res: Response, next: Next) => {
  res.send('Hello World!');
})

export default router;