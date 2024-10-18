import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req: Request) {
    return await this.usersService.getUserById(req);
  }
}
