let nodemailer = require("nodemailer");

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let transport = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS
        },tls: {
            rejectUnauthorized: false
        },
  });

  let mailOptions = {
    from: "Task Manager MERN <rajon.mern_stack@outlook.com>",
    to: EmailTo,
    subject: EmailSubject,
    //text: EmailText,
    html: `<html>
    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
    <h1 style="font-size: 32px; margin-bottom: 20px; text-align: center; color: blue">${EmailText}</h1>
    <p style="margin: 10px; font-size: 17px; text-align: center;">This is your OTP code. It's expire with 2 minutes</p>      
    <p>Regards...</p>
    <p>Task Manager Team</p
    </body>
  </html>`,
  };

  return await transport.sendMail(mailOptions);
};

module.exports = SendEmailUtility;