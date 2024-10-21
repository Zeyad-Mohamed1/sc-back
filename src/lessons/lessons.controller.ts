import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':courseId')
  findAll(@Param('courseId') courseId: string) {
    return this.lessonsService.findAll(courseId);
  }

  @Get('lesson/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }
}
