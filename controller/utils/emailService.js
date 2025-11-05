import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, content, isHtml = false) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your Company" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    [isHtml ? "html" : "text"]: content,
  };

  return await transporter.sendMail(mailOptions);
};
