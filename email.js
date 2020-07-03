import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    type: "login", // default
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const getPasswordResetURL = (user, token) =>
  `http://localhost:3000/password/reset/${user.email}/${token}`;

export const resetPasswordTemplate = (user, url) => {
  console.log("Reset user ", user.email);

  const from = process.env.EMAIL_LOGIN;
  const to = `${user.email}`;
  const subject = "🌻 Appointment Scheduler Password Reset 🌻";
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>We heard that you lost your password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  <p>Do something outside today! </p>
    `;

  return { from, to, subject, html };
};
