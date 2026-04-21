import { Router } from 'express';
import { login, register, logout, getProfile } from '../controllers/authController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import validateSchema from '../middleware/validateSchema.js';
import { loginSchema, signupSchema } from '../middleware/authSchemas.js';

const router = Router();

router.post('/login', validateSchema(loginSchema), login);
router.post('/register', validateSchema(signupSchema), register);
router.post('/logout', logout);
router.get('/profile', verificarToken, getProfile);

export default router;
