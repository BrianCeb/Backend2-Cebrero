import { Router } from 'express';
import passport from 'passport';
import {
    registerSuccess,
    loginSuccess,
    failRegister,
    failLogin,
    getCurrentUser,
    forgotPassword,
    resetPassword
} from '../controllers/session.controller.js';

const router = Router();

router.post('/register',
    passport.authenticate('register', { session: false, failureRedirect: '/api/sessions/failregister' }),
    registerSuccess
);

router.post('/login',
    passport.authenticate('login', { session: false, failureRedirect: '/api/sessions/faillogin' }),
    loginSuccess
);

router.get('/failregister', failRegister);
router.get('/faillogin', failLogin);

router.get('/current',
    passport.authenticate('jwt', { session: false }),
    getCurrentUser
);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
