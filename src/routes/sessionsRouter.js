import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/hashUtil.js';
import passport from 'passport';

const router = Router();
const JWT_SECRET = 'coderSecret'; 

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: 'error', message: 'User already exists' });

        const hashedPassword = createHash(password);
        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.send({ status: 'success', user });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
        return res.status(401).send({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ status: 'success', token });
});

router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.send({ status: 'success', user: req.user });
    }
);

export default router;
