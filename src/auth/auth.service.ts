import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const userExists = await this.prisma.user.findFirst({
        where: { studentNumber: user.studentNumber },
      });

      if (userExists) {
        return new BadRequestException(
          'User with this student number already exists',
        );
      }

      const hashedPassword = await this.usersService.hashPassword(
        user.password,
      );
      user.password = hashedPassword;

      await this.prisma.user.create({
        data: user,
      });

      return { message: 'User created successfully' };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async login(@Body() credentials: LoginUserDto, res: Response) {
    const exists = await this.usersService.getUser({
      studentNumber: credentials.studentNumber,
    });

    if (!exists) {
      return new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(credentials.password, exists.password);

    if (!isMatch) {
      return new BadRequestException('رقم الطالب او كلمة المرور غير صحيحة');
    }

    const { password, ...userWithoutPassword } = exists;

    const payload = {
      ...userWithoutPassword,
    };

    const token = await this.jwtService.signAsync(payload);

    return res
      .cookie('token', token, {
        httpOnly: true,
      })
      .send({ messaeg: 'تم تسجيل الدخول بنجاح' });
  }
}
