import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

export const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
