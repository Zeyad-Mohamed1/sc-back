import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAllCoursesForUser(yearName: string) {
    const yearWithCourses = await this.prisma.year.findUnique({
      where: {
        name: yearName,
      },
      include: {
        CoursesOfYear: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!yearWithCourses) {
      throw new BadRequestException(`هذا العام غير موجود`);
    }

    const activeCourses = yearWithCourses.CoursesOfYear.filter(
      (c) => c.course.isActive,
    ).map((c) => c.course);

    if (activeCourses.length === 0 || !activeCourses) {
      throw new NotFoundException(`لا يوجد كورسات متاحة ل${yearName}`);
    }

    return activeCourses;
  }
}
