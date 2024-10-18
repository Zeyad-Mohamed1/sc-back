import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import { LoginUserDto } from './dtos/login-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }

  @Post('login')
  async login(@Body() user: LoginUserDto, @Res() res: Response) {
    return this.authService.login(user, res);
  }
}
