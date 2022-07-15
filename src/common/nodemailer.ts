import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASSWORD },
});

export async function sendMailToNewUsers(mail: string) {
  try {
    let mailOptions = {
      from: `"Mati Monas"`,
      to: mail,
      subject: 'Welcome to Mati Monas Alkemy Challenge',
      text: 'The user has been created successfully. Please, login to the application. Thank you for your interest in Mati Monas Alkemy Challenge.',
    };

    console.log(mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email sent');

    return;
  } catch (error) {
    console.log(error);
  }
}
