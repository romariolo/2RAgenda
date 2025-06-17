import { Router } from 'express';
import { createUser, getUserBySlug } from '../controllers/userController';

const router = Router();

// Rota para criar um novo usuário: POST /api/users/
router.post('/', createUser);

// Rota para buscar um usuário pelo seu "apelido": GET /api/users/joao-silva
router.get('/:slug', getUserBySlug);

export default router;