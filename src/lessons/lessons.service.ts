import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!lessons || lessons.length === 0) {
      throw new NotFoundException('لا يوجد دروس متاحة');
    }

    return lessons;
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      include: {
        pdf: true,
        video: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    return lesson;
  }
}
