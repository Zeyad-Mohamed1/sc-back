import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        courseId,
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
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    return lesson;
  }
}
