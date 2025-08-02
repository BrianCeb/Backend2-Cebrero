import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserDTO from '../dto/user.dto.js';
const router = Router();
const JWT_SECRET = 'coderSecret';


router.post('/register',
    passport.authenticate('register', { session: false, failureRedirect: '/api/sessions/failregister' }),
    (req, res) => {
        res.send({ status: 'success', message: 'Usuario registrado con éxito' });
    }
);

router.post('/login',
    passport.authenticate('login', { session: false, failureRedirect: '/api/sessions/faillogin' }),
    (req, res) => {
        const user = req.user;
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.send({
            status: 'success',
            message: 'Login exitoso',
            token
        });
    }
);

router.get('/failregister', (req, res) => {
    res.status(400).send({ status: 'error', message: 'Falló el registro (usuario existente u otro error)' });
});

router.get('/faillogin', (req, res) => {
    res.status(401).send({ status: 'error', message: 'Credenciales inválidas' });
});

router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const userDTO = new UserDTO(req.user);
        res.send({ status: 'success', user: userDTO });
    }
);


export default router;
