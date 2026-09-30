import { Controller, Post, Body, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const data = await this.authService.googleLogin(req);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if ('access_token' in data) {
      res.cookie('google_auth_token', data.access_token, {
        httpOnly: false, 
        secure: false,
        sameSite: 'lax',
        maxAge: 60000 // 1 minute
      });
      return res.redirect(frontendUrl);
    }
    
    return res.redirect(`${frontendUrl}?error=google_auth_failed`);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.code || body.token, body.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req: any) {
    const user = await this.usersService.findById(req.user.sub);
    if (user) {
        const { password, resetToken, resetTokenExpiry, ...result } = user;
        return result;
    }
    return null;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('onboarding')
  async completeOnboarding(@Request() req: any, @Body() body: any) {
    // Validate role
    let newRole = 'OTHER';
    if (body.role === 'STUDENT' || body.role === 'WORKING_PROFESSIONAL') {
      newRole = body.role;
    }
    
    await this.usersService.update(req.user.sub, {
      phone: body.phone,
      city: body.city,
      linkedin: body.linkedin,
      github: body.github,
      role: newRole
    });
    return { message: 'Onboarding complete' };
  }
}
