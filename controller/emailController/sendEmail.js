import { sendEmail } from "../utils/emailService.js";

export const handleSendEmail = async (req, res) => {
  try {
    const { to, subject } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: "Fields 'to' and 'subject' are required.",
      });
    }

     const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background: #fff;
          margin: 40px auto;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
        }
        h1 { color: #333; }
        p { color: #555; line-height: 1.6; }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #008CBA;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Our Platform 🎉</h1>
        <p>Hi there! We’re thrilled to have you on board.<br>
                Please visit our link. 

        </p>
        <a href="http://localhost:3000" class="button">
          Visit Dashboard
        </a>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;



    const info = await sendEmail(to, subject, htmlContent, true); 

    res.json({
      success: true,
      message: "Welcome email sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
    });
  }
};
