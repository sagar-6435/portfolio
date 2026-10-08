import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // SMTP Config variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL || smtpUser;

    // Check if SMTP is configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("⚠️ SMTP Config is missing! Logging submission details locally:\n", {
        name,
        email,
        subject,
        message,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Form submitted successfully (Demo Mode: SMTP variables not set in .env, logged to console instead).",
        },
        { status: 200 }
      );
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Elegant HTML template matching Sagar's portfolio theme
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Portfolio Message</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #faf8f5;
              color: #1c1b19;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid rgba(28, 27, 25, 0.08);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(28, 27, 25, 0.03);
            }
            .header {
              background-color: #1c1b19;
              padding: 30px;
              text-align: center;
              border-bottom: 3px solid #947145;
            }
            .logo {
              display: inline-block;
              width: 36px;
              height: 36px;
              line-height: 36px;
              background-color: #947145;
              color: #ffffff;
              font-family: Georgia, serif;
              font-size: 18px;
              font-weight: bold;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              color: #ffffff;
              font-family: Georgia, serif;
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 0.5px;
            }
            .content {
              padding: 30px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #947145;
              margin-bottom: 5px;
            }
            .value {
              font-size: 15px;
              line-height: 1.5;
            }
            .value a {
              color: #947145;
              text-decoration: none;
              font-weight: 600;
            }
            .message-box {
              background-color: #faf8f5;
              border-left: 4px solid #947145;
              padding: 20px;
              border-radius: 4px;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              color: #1c1b19;
              margin-top: 10px;
            }
            .footer {
              background-color: #faf8f5;
              padding: 20px;
              text-align: center;
              font-size: 11px;
              color: rgba(28, 27, 25, 0.5);
              border-top: 1px solid rgba(28, 27, 25, 0.05);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">S</div>
              <h1>New Portfolio Message</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Sender Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Sender Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value"><strong>${subject}</strong></div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              This message was sent securely from the contact form on your portfolio website.
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${smtpUser}>`, // Sender details (sent via your auth user)
      to: contactEmail,                // Recipient email (your inbox)
      replyTo: email,                  // Clicking reply goes back to the sender
      subject: `[Portfolio Inquiry] ${subject}`,
      html: htmlTemplate,
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message." },
      { status: 500 }
    );
  }
}
