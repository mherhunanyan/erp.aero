import { Router } from 'express';
import {
    logutHandler,
    siginNewTokenHandler,
    signinHandler,
    signupHandler,
} from 'controllers/AuthController';

export const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);
authRouter.post('/sigin/new_token', siginNewTokenHandler);
authRouter.post('/logout', logutHandler);
