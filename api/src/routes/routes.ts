import { Router } from 'express';
import { createSessionHandler, deleteSessionHandler, getSessionHandler } from '../controllers/session-controller';
import { requireUser } from '../middleware/requireUser';

const router = Router();

router.get('/', (_, res) => {
  res.send('hello');
});

router.post('/api/session', createSessionHandler);
router.get('/api/session', requireUser, getSessionHandler);
router.delete('/api/session', requireUser, deleteSessionHandler);

export default router;
