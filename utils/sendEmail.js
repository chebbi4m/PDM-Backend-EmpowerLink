import nodemailer from 'nodemailer'; 

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject,
      html, // This was missing in your original code
    });

    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;