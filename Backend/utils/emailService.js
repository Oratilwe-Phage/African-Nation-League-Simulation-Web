import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"African Nations League" <${testAccount.user}>`,
    to,
    subject,
    text,
  });

  console.log("✅ Email sent! Preview it here:");
  console.log(nodemailer.getTestMessageUrl(info));
};






