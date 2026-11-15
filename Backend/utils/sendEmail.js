import { mailSender } from "../config/email.js";

export const sendEmail = ({ to, subject, html, text }) =>
  mailSender(to, subject, html, text);
