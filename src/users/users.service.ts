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
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hashSync(password, saltOrRounds);
      return hash;
    } catch (error) {
      console.log(error);
    }
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

    const data = await this.jwtService.decode(cookie);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (!data) {
      throw new UnauthorizedException('برجاء تسجيل الدخول اولا');
    }

    if (data.exp < currentTime) {
      throw new UnauthorizedException(
        'تم انتهاء صلاحية الجلسة. الرجاء تسجيل الدخول مجددا',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    return user;
  }

  async getPurchasedCourses(req: Request) {
    const cookie = req.cookies['token'];

    if (!cookie) {
      throw new UnauthorizedException();
    }

    const data = await this.jwtService.decode(cookie);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (!data) {
      throw new UnauthorizedException('برجاء تسجيل الدخول اولا');
    }

    if (data.exp < currentTime) {
      throw new UnauthorizedException(
        'تم انتهاء صلاحية الجلسة. الرجاء تسجيل الدخول مجددا',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    // Fetch courses associated with the user
    const userCourses = await this.prisma.coursesOfUsers.findMany({
      where: {
        userId: user.id,
      },
      include: {
        course: true, // Include course details
      },
    });

    // Check if the user has any purchased courses
    if (!userCourses || userCourses.length === 0) {
      throw new NotFoundException('لا يوجد كورسات تم شرائها');
    }

    // Return only the course details, if you want to return a simplified response
    return userCourses.map(({ course }) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      price: course.price,
      image: course.image,
      isActive: course.isActive,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));
  }
}
