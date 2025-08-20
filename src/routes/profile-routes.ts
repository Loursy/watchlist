import { Router } from 'express';
import { getProfile, editProfile, changePassword } from '@/controller/profile-controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = Router();
router.get('/', verifyToken, getProfile);
router.put('/edit', verifyToken, editProfile);
router.put('/changepassword', verifyToken, changePassword);

export default router;
