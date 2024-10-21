import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAllCoursesForUser(yearId: string) {
    const course = await this.prisma.course.findMany({
      where: {
        isActive: true,
        CoursesOfYear: {
          some: {
            yearId,
          },
        },
      },
    });

    if (!course || course.length === 0) {
      throw new NotFoundException('لا يوجد كورسات متاحة');
    }

    return course;
  }
}
