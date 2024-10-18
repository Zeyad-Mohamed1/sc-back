import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async getUser({ studentNumber }: { studentNumber: string }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { studentNumber },
    });
    return user;
  }

  async getUserById(req: Request): Promise<User> {
    const cookie = req.cookies['token'];

    if (!cookie) {
      return null;
    }

    const data = await this.jwtService.verifyAsync(cookie);

    if (!data) {
      return null;
    }

    return data;
  }
}
