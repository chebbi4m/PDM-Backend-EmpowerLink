import nodemailer from 'nodemailer';

const sendEmail = async ( to, subject, text) => {
  try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to:to,
          subject,
          text,
      });

      console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
      console.error(error);
  }
};

export default sendEmail;
