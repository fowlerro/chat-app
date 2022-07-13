import { Router } from 'express';

import authController from '../controllers/auth';
import auth from '../middleware/auth';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.put('/change-password', auth, authController.changePassword);
router.delete('/delete-account', auth, authController.deleteAccount);

export default router;
