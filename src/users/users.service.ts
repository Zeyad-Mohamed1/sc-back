import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
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
      throw new UnauthorizedException();
    }

    const data = await this.jwtService.verifyAsync(cookie);

    return data;
  }

  async getPurchasedCourses(userId: string) {
    if (!userId || userId === '') {
      throw new UnauthorizedException('يجب تسجيل الدخول اولا');
    }
    // Step 1: Retrieve the courses owned by the user
    const userCourses = await this.prisma.coursesOfUsers.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true, // Include course details
      },
    });

    if (!userCourses || userCourses.length === 0) {
      throw new NotFoundException('لا يوجد كورسات تم شرائها');
    }

    // Step 2: Format the purchased courses for display
    const purchasedCourses = userCourses.map((uc) => ({
      id: uc.course.id,
    }));

    // Step 3: Return the purchased courses
    return purchasedCourses;
  }
}
