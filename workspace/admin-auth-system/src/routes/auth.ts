import { Router } from 'express';
import { AuthController } from '../controllers/auth';

const router = Router();
const authController = new AuthController();

// Login route
router.post('/login', authController.login.bind(authController));

export default router;