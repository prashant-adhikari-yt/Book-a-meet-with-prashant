const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Clean, minimalist email template wrapper (shadcn style)
const emailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          ${content}
        </table>
        
        <!-- Footer -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <tr>
            <td style="text-align: center; padding: 0; color: #9ca3af; font-size: 12px; line-height: 20px;">
              <p style="margin: 0;">Prashant  Adhikari &copy; ${new Date().getFullYear()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Send confirmation email to visitor
const sendBookingConfirmation = async (booking) => {
  const content = `
    <tr>
      <td style="padding: 0;">
        <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
          Booking Confirmed
        </h1>
        <p style="margin: 0 0 32px 0; color: #64748b; font-size: 14px;">
          Your appointment has been scheduled
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td style="padding: 24px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                Appointment Details
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Name</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.name}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Date</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.date}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Time</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.time}</p>
                  </td>
                </tr>
                ${
                  booking.note
                    ? `
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Note</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px;">${booking.note}</p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>
        </table>

        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
          If you need to make any changes, please reply to this email.
        </p>
      </td>
    </tr>
  `;

  const mailOptions = {
    from: `"Prashant Adhikari" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Booking Confirmation",
    html: emailTemplate(content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to visitor");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

// Send notification email to admin
const sendAdminNotification = async (booking) => {
  const content = `
    <tr>
      <td style="padding: 0;">
        <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
          New Booking Received
        </h1>
        <p style="margin: 0 0 32px 0; color: #64748b; font-size: 14px;">
          A new appointment has been scheduled
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding: 24px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                Client Details
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Name</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.name}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Email</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;"><a href="mailto:${booking.email}" style="color: #0f172a; text-decoration: underline;">${booking.email}</a></p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Date</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.date}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Time</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.time}</p>
                  </td>
                </tr>
                ${
                  booking.note
                    ? `
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Note</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-style: italic;">"${booking.note}"</p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>
        </table>

        <a href="http://localhost:5173/admin/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">
          View Dashboard
        </a>
      </td>
    </tr>
  `;

  const mailOptions = {
    from: `"Prashant Adhikari" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${booking.name} - ${booking.date} at ${booking.time}`,
    html: emailTemplate(content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification email sent to admin");
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};

// Send OTP email to visitor
const sendOTPEmail = async (email, otp) => {
  const content = `
    <tr>
      <td style="padding: 0; text-align: center;">
        <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
          Email Verification
        </h1>
        <p style="margin: 0 0 32px 0; color: #64748b; font-size: 14px;">
          Enter this code to verify your email address
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td style="padding: 32px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                Verification Code
              </p>
              <p style="margin: 0; color: #0f172a; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">
          This code will expire in <strong style="color: #0f172a;">10 minutes</strong>
        </p>

        <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </td>
    </tr>
  `;

  const mailOptions = {
    from: `"Prashant Adhikari" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: emailTemplate(content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Send reminder email to visitor
const sendReminderEmail = async (booking) => {
  // Calculate time remaining
  const now = new Date();
  const appointmentDate = new Date(`${booking.date}T${booking.time}`);
  const diffMs = appointmentDate - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  let timeRemainingText = "";
  if (diffDays > 0) {
    timeRemainingText = `${diffDays} day${diffDays > 1 ? "s" : ""} and ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    timeRemainingText = `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    timeRemainingText = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
  }

  const content = `
    <tr>
      <td style="padding: 0; text-align: center;">
        <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
          Appointment Reminder
        </h1>
        <p style="margin: 0 0 32px 0; color: #64748b; font-size: 14px;">
          Your appointment is coming up soon
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                Time Remaining
              </p>
              <p style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 600;">
                ${timeRemainingText}
              </p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          <tr>
            <td style="padding: 24px 0; border-bottom: 1px solid #e2e8f0; text-align: left;">
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                Appointment Details
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Name</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.name}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Date</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.date}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Time</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500;">${booking.time}</p>
                  </td>
                </tr>
                ${
                  booking.note
                    ? `
                <tr>
                  <td width="30%" style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">Note</p>
                  </td>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <p style="margin: 0; color: #0f172a; font-size: 14px;">${booking.note}</p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>
        </table>

        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
          Looking forward to seeing you soon. If you need to make any changes, please reply to this email.
        </p>
      </td>
    </tr>
  `;

  const mailOptions = {
    from: `"Prashant Adhikari" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: `Reminder: Your appointment is in ${timeRemainingText}`,
    html: emailTemplate(content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reminder email sent to visitor");
    return { success: true };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
  sendOTPEmail,
  sendReminderEmail,
};
