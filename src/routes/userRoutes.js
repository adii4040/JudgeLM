import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/userController.js';
import { verifyJwt } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Secured Routes
router.route('/logout').post(verifyJwt, logoutUser);
router.route('/@me').get(verifyJwt, getCurrentUser);

export default router;
