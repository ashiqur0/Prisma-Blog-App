import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER!,
        pass: process.env.APP_PASSWORD!,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                default: "user",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                default: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prisma_blog@ph.com>',
                    to: user.email,
                    subject: "Verify Your Email Address",
                    text: `Please verify your email by clicking this link: ${verificationURL}`,
                    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0; color:#333;">Prisma Blog</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="color:#555; font-size:16px; line-height:1.6;">
                <p>Hello,</p>
                <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="${verificationURL}" 
                   style="background-color:#4CAF50; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">
                   Verify Email
                </a>
              </td>
            </tr>

            <!-- Fallback Link -->
            <tr>
              <td style="color:#555; font-size:14px; line-height:1.6;">
                <p>If the button doesn't work, copy and paste the following link into your browser:</p>
                <p style="word-break:break-all;">
                  <a href="${verificationURL}" style="color:#1a73e8;">${verificationURL}</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:20px; font-size:12px; color:#999; text-align:center;">
                <p>If you did not create an account, you can safely ignore this email.</p>
                <p>&copy; ${new Date().getFullYear()} Prisma Blog. All rights reserved.</p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("Error sending verification email:", error);
                throw new Error("Failed to send verification email");
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});