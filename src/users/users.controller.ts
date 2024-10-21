import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req: Request) {
    return await this.usersService.getUserById(req);
  }

  @Get('courses')
  async getUserCourses(@Query('userId') userId: string) {
    if (!userId) userId = '';
    return await this.usersService.getPurchasedCourses(userId);
  }
}
