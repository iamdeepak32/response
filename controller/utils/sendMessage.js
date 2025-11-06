// utils/sendMessage.js
import { sendEmail } from "./emailService.js";

export async function sendInvitationEmail(user) {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="background: white; border-radius: 10px; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">🎉 Invitation to Join ${user.companyName || "Our Platform"}</h2>
          <p>Hi <b>${user.firstName || user.name}</b>,</p>
          <p>We’re excited to invite you to our dashboard. Click below to join:</p>
          <a href="http://localhost:3000"
             style="background: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
             Visit Dashboard
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Your Company</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail(user.email, "You're Invited!", htmlContent, true);
}
