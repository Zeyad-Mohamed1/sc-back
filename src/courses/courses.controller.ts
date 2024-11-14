import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('/course/:id')
  findCoursewithLessons(@Param('id') id: string) {
    return this.coursesService.findCoursewithLessons(id);
  }

  @Get(':yearName')
  findAllCoursesForUser(@Param('yearName') yearName: string) {
    return this.coursesService.findAllCoursesForUser(yearName);
  }
}
