import { Router } from 'express';
import { createUser, getUserBySlug } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/:slug', getUserBySlug);

export default router;