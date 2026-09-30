import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  async register(data: any) {
    const tempEmailRegex = /yopmail|tempmail|guerrilla|10minutemail|mailinator|dropmail|disposable|trashmail|throwaway|fakemail|generator|mohmal|mailnesia|sharklasers/i;
    if (data.email.match(tempEmailRegex)) {
      throw new BadRequestException('Temporary or disposable emails are not allowed');
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!data.password.match(passwordRegex)) {
      throw new BadRequestException('Password must be at least 6 chars and contain uppercase, lowercase, number, and special character');
    }
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword
    });
    return this.login(user);
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return { message: 'No user from google' };
    }
    
    const { email, firstName, lastName, googleId } = req.user;
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      user = await this.usersService.create({
        email,
        name: `${firstName} ${lastName}`.trim(),
        googleId
      });
    } else if (!user.googleId) {
      user = await this.usersService.update(user.id, { googleId });
    }

    return this.login(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If email exists, a reset link has been sent' };
    }
    // Generate simple token for demo
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    
    const pkg = await import('pg');
    const { Client } = pkg.default ? pkg.default : pkg;
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query('UPDATE "User" SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3', [resetToken, resetTokenExpiry, user.id]);
    await client.end();
    
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0046c0; margin: 0;">Nerds Room</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #555555; font-size: 16px; line-height: 1.5;">
            Hello ${user.name},
          </p>
          <p style="color: #555555; font-size: 16px; line-height: 1.5;">
            We received a request to reset the password for your Nerds Room account. 
            Your verification code is:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #333333; background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 6px; letter-spacing: 2px; user-select: all; -webkit-user-select: all; cursor: text;">
              ${resetToken}
            </span>
          </div>
          <p style="color: #555555; font-size: 16px; line-height: 1.5;">
            This code will expire in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Nerds Room. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Nerds Room" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Password Reset Code - Nerds Room",
        text: `Your password reset code is: ${resetToken}\nThis code is valid for 1 hour.`,
        html: emailHtml,
      });
      return { message: 'If email exists, a reset link has been sent' };
    } catch (error) {
      console.error('Error sending email', error);
      throw new BadRequestException('Could not send reset email. Check SMTP settings.');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!newPassword.match(passwordRegex)) {
      throw new BadRequestException('Password must be at least 6 chars and contain uppercase, lowercase, number, and special character');
    }

    const pkg = await import('pg');
    const { Client } = pkg.default ? pkg.default : pkg;
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const result = await client.query('SELECT * FROM "User" WHERE "resetToken" = $1 AND "resetTokenExpiry" > $2', [token, new Date()]);
    const user = result.rows[0];

    if (!user) {
      await client.end();
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query('UPDATE "User" SET password = $1, "resetToken" = null, "resetTokenExpiry" = null WHERE id = $2', [hashedPassword, user.id]);
    await client.end();

    return { message: 'Password updated successfully' };
  }
}

