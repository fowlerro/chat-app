import { Router } from 'express';
import upload from '../../multer';

import usersController from '../controllers/users';

import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, usersController.getUser);
router.put(
  '/profile',
  auth,
  upload.single('avatar'),
  usersController.changeProfile
);

export default router;
