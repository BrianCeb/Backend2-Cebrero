import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS:', process.env.MAIL_PASS);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Backend 2" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html
    });
};
