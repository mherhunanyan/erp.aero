import { signinHandler, signupHandler } from 'controllers/AuthController';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);
