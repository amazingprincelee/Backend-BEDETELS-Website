import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

let isMailerReady = false;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Verify transporter once at startup
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ Nodemailer verification failed:", err.message);
    isMailerReady = false;
  } else {
    console.log("✅ Nodemailer transporter ready:", success);
    isMailerReady = true;
  }
});

// Wrapper to safely send emails
export async function safeSendMail(mailOptions) {
  if (!isMailerReady) {
    console.log("⚠️ Mailer not ready, skipping email:", mailOptions.subject);
    return { skipped: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error };
  }
}

export function sendVerificationCode(to, code) {
  const mailOption = {
    from: '"Bedetels" <nnavictor727@gmail.com>',
    to,
    subject: `${code} is your verification code`,
    text: `Dear User, \n\n Your verification code is ${code} \n\n Thanks for registering, for further enquires, please contact school management:\n phone: 08035442001`
  };

  return safeSendMail(mailOption);
}

export function sendUserCredentials(userData, password) {
  const { fullname, email, role } = userData;

  const roleTitle = role === "teacher" ? "Teacher" : "Parent";
  const subject = `Welcome to Bedetels School - Your ${roleTitle} Account Credentials`;

  const mailOption = {
    from: '"Bedetels School" <nnavictor727@gmail.com>',
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Welcome to Bedetels School!</h2>
          
          <p>Dear ${fullname},</p>
          <p>Welcome to Bedetels School Management System! Your ${role} account has been successfully created.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
          </div>
          
          <p style="color: #dc3545; font-weight: bold;">⚠️ Important Security Notice:</p>
          <ul style="color: #6c757d;">
              <li>Please change your password after your first login</li>
              <li>Keep your credentials secure and do not share them with anyone</li>
              <li>Contact the school administration if you have any issues accessing your account</li>
          </ul>
      </div>
    `
  };

  return safeSendMail(mailOption);
}
