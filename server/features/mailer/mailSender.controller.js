import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS,
    },
})

export const mailSender = {
    async sendVerificationCode(email, code) {
        await transporter.sendMail({
            from: process.env.MAILUSER,
            to: email,
            subject: 'Подтверждение почты',

            html: `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial;">
    <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e8e8e8;">

      <div style="background:#1677ff; padding:24px; color:white;">
        <h2 style="margin:0; font-size:20px;">Подтверждение аккаунта</h2>
        <p style="margin:6px 0 0; opacity:0.85;">Почти готово. Остался один шаг.</p>
      </div>

      <div style="padding:28px;">
        <p style="font-size:14px; color:#333;">
          Мы получили запрос на регистрацию. Используйте код ниже для подтверждения почты:
        </p>

        <div style="
          margin:24px 0;
          font-size:28px;
          letter-spacing:6px;
          text-align:center;
          font-weight:600;
          color:#1677ff;
          background:#f0f5ff;
          padding:14px;
          border-radius:8px;
        ">
          ${code}
        </div>

        <p style="font-size:13px; color:#888;">
          Код действует 10 минут. Если это были не вы — просто игнорируйте это письмо.
        </p>

      </div>

      <div style="padding:16px; font-size:12px; color:#999; text-align:center; border-top:1px solid #eee;">
        © ${new Date().getFullYear()} Your Company. All rights reserved.
      </div>

    </div>
  </body>
</html>
            `,
        })
    },

    async sendCompanyInvite(email, inviteToken, companyName) {
        const link = `${process.env.CLIENT_URL}/invite/${inviteToken}/accept`

        await transporter.sendMail({
            from: process.env.MAILUSER,
            to: email,
            subject: `Приглашение в компанию ${companyName}`,

            html: `
<!doctype html>
<html>
  <body style="margin:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial;">
    <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e8;">

      <div style="background:#1677ff;padding:24px;color:#fff;">
        <h2 style="margin:0;font-size:18px;">Приглашение в компанию</h2>
        <p style="margin:6px 0 0;opacity:0.85;">Вас пригласили присоединиться к ${companyName}</p>
      </div>

      <div style="padding:28px;">
        <p style="font-size:14px;color:#333;">
          Вам отправлено приглашение. Чтобы присоединиться к компании, нажмите кнопку ниже.
        </p>

        <div style="text-align:center;margin:26px 0;">
          <a href="${link}"
             style="
               background:#1677ff;
               color:#fff;
               padding:12px 18px;
               border-radius:6px;
               text-decoration:none;
               font-size:14px;
               display:inline-block;
             ">
            Присоединиться
          </a>
        </div>

        <p style="font-size:12px;color:#888;word-break:break-all;">
          Если кнопка не работает: ${link}
        </p>

        <p style="font-size:12px;color:#999;margin-top:20px;">
          Если вы не ожидали это письмо — просто проигнорируйте его.
        </p>
      </div>

      <div style="padding:14px;text-align:center;font-size:12px;color:#aaa;border-top:1px solid #eee;">
        © ${new Date().getFullYear()} Company System
      </div>

    </div>
  </body>
</html>
            `,
        })
    },

}



