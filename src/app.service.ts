import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async getHello(): Promise<User[] | string> {
    const users = await this.prisma.user.findMany();

    if (users.length === 0) {
      return 'No users found';
    }

    return users;
  }
}
