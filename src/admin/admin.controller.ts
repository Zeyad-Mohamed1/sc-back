import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService, CreatePdfDto, CreateVideoDto } from './admin.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateYearDto } from 'src/years/dto/create-year.dto';
import { UpdateYearDto } from 'src/years/dto/update-year.dto';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { UpdateLessonDto } from 'src/lessons/dto/update-lesson.dto';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson.dto';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Start Users //////////////////////////////////////////////////////
  @Get('users')
  async getAllUsers(
    @Query('page') page: string,
    @Query('year') year: string,
    @Query('query') query: string,
  ) {
    if (!page) page = '1';
    return await this.adminService.getAllUsers(+page, query, year);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id);
  }
  // End Users ////////////////////////////////////////////////////////

  // Start Years //////////////////////////////////////////////////////
  @Post('years')
  create(@Body() createYearDto: CreateYearDto) {
    return this.adminService.createYear(createYearDto);
  }

  @Get('years')
  findAllForAdmin() {
    return this.adminService.findAllYearsForAdmin();
  }

  @Get('/years/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.adminService.findOneYearForAdmin(id);
  }

  @Patch('/years/:id')
  update(@Param('id') id: string, @Body() updateYearDto: UpdateYearDto) {
    return this.adminService.updateYear(id, updateYearDto);
  }

  @Patch('years/:id/active')
  updateActive(@Param('id') id: string) {
    return this.adminService.updateActiveForYear(id);
  }

  @Delete('years/:id')
  remove(@Param('id') id: string) {
    return this.adminService.removeYear(id);
  }
  // End Years //////////////////////////////////////////////////////

  // Start Courses //////////////////////////////////////////////////////
  @Post('courses/:yearId')
  createCourse(
    @Param('yearId') yearId: string,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.adminService.createCourse(createCourseDto, yearId);
  }

  @Get('courses/:yearId')
  findAllCoursesForAdmin(@Param('yearId') yearId: string) {
    return this.adminService.findAllCoursesForAdmin(yearId);
  }

  @Get('course/:courseId')
  findOne(@Param('courseId') courseId: string) {
    return this.adminService.findOneCourse(courseId);
  }

  @Patch('course/changeIsActive/:id')
  changeIsActive(@Param('id') id: string) {
    return this.adminService.changeIsActiveForCourse(id);
  }

  @Patch('course/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.adminService.updateCourse(id, updateCourseDto);
  }

  @Delete('course/:id')
  removeCourse(@Param('id') id: string) {
    return this.adminService.removeCourse(id);
  }
  // End Courses //////////////////////////////////////////////////////

  // Start Lessons ////////////////////////////////////////////////////
  @Post('lessons/:courseId')
  createLesson(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.adminService.createLesson(createLessonDto, courseId);
  }

  @Post('lesson/pdf/:id')
  addPdfToLesson(@Param('id') id: string, @Body() createPdfDto: CreatePdfDto) {
    return this.adminService.addPdf(id, createPdfDto);
  }

  @Post('/:id/videos')
  addVideoToLesson(
    @Param('id') id: string,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.adminService.addVideo(id, createVideoDto);
  }

  @Get('/:id/videos')
  getvideos(@Param('id') id: string) {
    return this.adminService.findAllVideosLessonForAdmin(id);
  }

  @Delete('/videos/:videoId')
  deleteVideo(@Param('videoId') videoId: string) {
    return this.adminService.deleteVideo(videoId);
  }

  @Get('lesson/pdf/:id')
  async getPdf(@Param('id') id: string) {
    return this.adminService.getPfd(id);
  }

  @Delete('lesson/pdf/:id')
  async deletePdf(@Param('id') id: string) {
    return await this.adminService.deletePdf(id);
  }

  @Patch('lesson/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.adminService.updateLesson(id, updateLessonDto);
  }

  @Patch('lesson/publish/:id')
  changePublished(@Param('id') id: string) {
    return this.adminService.changePublishedForLesson(id);
  }

  @Delete('lesson/:id')
  removeLesson(@Param('id') id: string) {
    return this.adminService.removeLesson(id);
  }

  // End Lessons //////////////////////////////////////////////////////
}
