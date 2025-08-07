import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';
import { PasswordResetToken } from '../dao/models/passwordResetTokenModel.js';
import { userModel } from '../dao/models/userModel.js';
import { createHash } from '../utils/hashUtil.js';
import { sendEmail } from '../utils/nodemailerUtil.js';
import crypto from 'crypto';

const JWT_SECRET = 'coderSecret';

export const registerSuccess = (req, res) => {
    res.send({ status: 'success', message: 'Usuario registrado con éxito' });
};

export const loginSuccess = (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({
        status: 'success',
        message: 'Login exitoso',
        token
    });
};

export const failRegister = (req, res) => {
    res.status(400).send({ status: 'error', message: 'Falló el registro (usuario existente u otro error)' });
};

export const failLogin = (req, res) => {
    res.status(401).send({ status: 'error', message: 'Credenciales inválidas' });
};

export const getCurrentUser = (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({ status: 'success', user: userDTO });
};

export const forgotPassword = async (req, res) => {
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
            <pre>${token}</pre>
            <p><strong>Token:</strong></p>
            <a href="${resetLink}">Restablecer contraseña</a>
            <p><strong>Link:</strong></p>
            <hr />
            <p>Este link expira en 1 hora.</p>
            <small>Si no solicitaste esto, ignorá este mensaje.</small>
        </div>`
    });

    res.send({ status: 'success', message: 'Correo enviado con instrucciones', token, email });
};

export const resetPassword = async (req, res) => {
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
};
