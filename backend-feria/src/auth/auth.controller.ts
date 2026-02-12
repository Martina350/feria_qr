import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      standId?: string | null;
    },
  ) {
    return this.authService.register({
      email: body.email,
      password: body.password,
      role: undefined,
      standId: body.standId ?? null,
    });
  }
}


