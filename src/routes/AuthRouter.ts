import { Router } from 'express';
import { isAuthMiddleware } from 'middlewares/IsAuthMiddleware';
import {
    getInfoHandler,
    logoutHandler,
    siginNewTokenHandler,
    signinHandler,
    signupHandler,
} from 'controllers/AuthController';

export const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);
authRouter.post('/sigin/new_token', siginNewTokenHandler);
authRouter.post('/logout', isAuthMiddleware, logoutHandler);
authRouter.get('/info', isAuthMiddleware, getInfoHandler);
