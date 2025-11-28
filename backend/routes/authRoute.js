import express from 'express';
import { register, login, getProfile, getAllUsers, removeUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/profile', authMiddleware, getProfile);
authRouter.get('/list', getAllUsers);
authRouter.post('/remove', removeUser);

export default authRouter;
