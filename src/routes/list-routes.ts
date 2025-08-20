import { Router } from 'express';
import {
  getLists,
  createList,
  addMovieToList,
  shareList,
  getSharedList
} from '@/controller/list-controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = Router();

router.get('/', verifyToken, getLists);
router.post('/create', verifyToken, createList);
router.post('/:id/add', verifyToken, addMovieToList);
router.post('/:id/share', verifyToken, shareList);
router.get('/shared/:code', getSharedList);

export default router;
