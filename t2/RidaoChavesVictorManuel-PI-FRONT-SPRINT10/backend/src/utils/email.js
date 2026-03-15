import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 1025,
        auth: process.env.SMTP_USER ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        } : undefined
    });

    const mailOptions = {
        from: 'FitFood <no-reply@fitfood.com>',
        to: options.email,
        subject: options.subject,
        text: options.mensaje,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
