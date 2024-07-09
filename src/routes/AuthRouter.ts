import { Router } from 'express';
import {
    logoutHandler,
    siginNewTokenHandler,
    signinHandler,
    signupHandler,
} from 'controllers/AuthController';
import { isAuthMiddleware } from 'middlewares/IsAuthMiddleware';

export const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);
authRouter.post('/sigin/new_token', siginNewTokenHandler);
authRouter.post('/logout', isAuthMiddleware, logoutHandler);
