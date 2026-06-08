import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS,
    },
    logger: true,
    debug: true,
})

async function sendEmail() {
    try {
        await transporter.verify();

        const info = await transporter.sendMail({
            from: '<example@site.com>',
            to: 'example@site.com',
            subject: 'Привет',
            text: 'Привет.',
        })

        console.log('Письмо  отправлено. Message ID:', info.messageId);
    } catch (error) {
        console.error('ErrorMail', error);
    } finally {
        transporter.close();
    }
}

sendEmail();