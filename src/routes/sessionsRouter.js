import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserDTO from '../dto/user.dto.js';
import { PasswordResetToken } from '../dao/models/passwordResetTokenModel.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/nodemailerUtil.js';
import { userModel } from '../dao/models/userModel.js';
import { createHash } from '../utils/hashUtil.js';
import path from 'path';
import { fileURLToPath } from 'url';




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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).send({ status: 'error', message: 'Email requerido' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    await PasswordResetToken.create({ userEmail: email, token, expiresAt });

    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
    await sendEmail({
        to: email,
        subject: 'Recuperar contraseña',
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Podés hacer clic en el siguiente link o copiar el token manualmente.</p>

        <p><strong>Token:</strong></p>
        <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${token}</pre>

        <p><strong>Link para restablecer:</strong></p>
        <a href="${resetLink}"
            style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Restablecer contraseña
    </a>

    <p style="margin-top: 20px;">Este link expira en 1 hora.</p>
    <hr />
    <small>Si no solicitaste esto, ignorá este mensaje.</small>
    </div>
`
    });


    res.send({ status: 'success', message: 'Correo enviado con instrucciones', token , email });
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).send({ status: 'error', message: 'Token inválido o expirado' });
    }

    const user = await userModel.findOne({ email: resetToken.userEmail });
    if (!user) return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });

    user.password = createHash(newPassword);
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    res.send({ status: 'success', message: 'Contraseña actualizada con éxito' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export default router;
