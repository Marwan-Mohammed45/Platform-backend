import nodemailer from "nodemailer";

export const sendemail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailoptions = {
    from: `"Platform" <${process.env.EMAIL_USER}>`, 
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailoptions);
  console.log("✅ Email sent:", info.messageId);
};
