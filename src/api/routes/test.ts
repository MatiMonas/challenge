import { Router, Next, Request, Response } from 'express';


const router = Router();

router.get('/', (req: Request, res: Response, next: Next) => {
  try {
    res.send('Hello World!');
  } catch (err) {
    next(err);
  }
});

export default router;
