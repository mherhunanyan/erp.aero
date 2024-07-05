import { signinHandler, signupHandler } from 'controllers/AuthController';
import express from 'express';

export const authRouter = express.Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/signin', signinHandler);

