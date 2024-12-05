import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson.dto';
import { UpdateLessonDto } from 'src/lessons/dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateYearDto } from 'src/years/dto/create-year.dto';
import { UpdateYearDto } from 'src/years/dto/update-year.dto';

export type CreatePdfDto = {
  name: string;
  url: string;
};

export type CreateVideoDto = {
  name: string;
  url: string;
  description: string;
};

export type UpdateVideoDto = {
  name?: string;
  url?: string;
  description?: string;
};

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  // Start USer //////////////////////////////////////////////
  async getAllUsers(
    page: number,
    query?: string,
    year?: string,
  ): Promise<{
    users: User[];
    totalPages: number;
    usersOnCurrentPage: number;
  }> {
    try {
      const USERS_PER_PAGE = 20;

      // Build the query conditions
      const whereClause: any = {};
      if (query) {
        whereClause.OR = [
          { firstName: { contains: query, mode: 'insensitive' } }, // Assuming users have a 'name' field
          { studentNumber: { contains: query, mode: 'insensitive' } }, // Assuming users have an 'email' field
        ];
      }
      if (year) {
        whereClause.yearOfStudy = year;
      }

      // Get the total count of users based on the query
      const totalUsers = await this.prisma.user.count({
        where: whereClause,
      });

      const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

      // Fetch the paginated users based on the query
      const users = await this.prisma.user.findMany({
        where: whereClause,
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('لا يوجد مستخدمين');
      }

      // Get the number of users on the current page
      const usersOnCurrentPage = users.length;

      return { users, totalPages, usersOnCurrentPage };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    // Check if user exists
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود بالفعل');
    }

    // Delete related CoursesOfUsers records
    await this.prisma.coursesOfUsers.deleteMany({
      where: { userId: id },
    });

    // Now delete the user
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'تم حذف المستخدم بنجاح' };
  }

  async updatePasswordForUser({
    id,
    password,
  }: {
    id: string;
    password: string;
  }) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('المستخدم غير موجود بالفعل');
      }

      const hashedPassword = await this.usersService.hashPassword(password);

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return { message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      console.log(error);
    }
  }

  async getStatistics() {
    try {
      const totalUsers = await this.prisma.user.count();
      const totalCourses = await this.prisma.course.count();
      const totalLessons = await this.prisma.lesson.count();
      const totalYears = await this.prisma.year.count();

      return {
        totalUsers,
        totalCourses,
        totalLessons,
        totalYears,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getCoursesForUser(id: string) {
    const courses = await this.prisma.coursesOfUsers.findMany({
      where: { userId: id },
      include: { course: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!courses || courses.length === 0) {
      throw new NotFoundException('لا يوجد كورسات لهذا المستخدم');
    }

    return courses;
  }

  async addCourseForUser({
    userId,
    courseId,
  }: {
    userId: string;
    courseId: string;
  }) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    const exists = await this.prisma.coursesOfUsers.findFirst({
      where: { userId, courseId },
    });

    if (exists) {
      throw new BadRequestException('الكورس موجود بالفعل لهذا المستخدم');
    }

    await this.prisma.coursesOfUsers.create({
      data: {
        userId,
        courseId,
      },
    });

    return { message: 'تم اضافة الكورس للمستخدم بنجاح' };
  }

  async removeCourseForUser({ id }: { id: string }) {
    await this.prisma.coursesOfUsers.deleteMany({
      where: { id },
    });
    return { message: 'تم حذف الكورس من المستخدم بنجاح' };
  }
  // End USer //////////////////////////////////////////////

  // Start Year //////////////////////////////////////////////
  async createYear(createYearDto: CreateYearDto) {
    const year = await this.prisma.year.findUnique({
      where: {
        name: createYearDto.name,
      },
    });

    if (year) {
      throw new BadRequestException('الاسم موجود بالفعل');
    }

    await this.prisma.year.create({
      data: {
        name: createYearDto.name,
        image: createYearDto.image,
      },
    });

    return {
      message: 'تم اضافة العام بنجاح',
    };
  }

  async findAllYearsForAdmin() {
    const years = await this.prisma.year.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (!years || years.length === 0) {
      throw new NotFoundException('لا يوجد سنين متاحة لعرضها');
    }

    return years;
  }

  async findOneYearForAdmin(id: string) {
    const year = await this.prisma.year.findUnique({
      where: {
        id,
      },
    });

    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    return year;
  }

  async updateYear(id: string, updateYearDto: UpdateYearDto) {
    const year = await this.prisma.year.findUnique({
      where: {
        id,
      },
    });

    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    await this.prisma.year.update({
      where: {
        id,
      },
      data: updateYearDto,
    });

    return {
      message: 'تم تحديث السنة بنجاح',
    };
  }

  async updateActiveForYear(id: string) {
    const year = await this.prisma.year.findUnique({
      where: {
        id,
      },
    });

    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    await this.prisma.year.update({
      where: {
        id,
      },
      data: {
        isActive: !year.isActive,
      },
    });

    return {
      message: 'تم تحديث الحالة بنجاح',
    };
  }

  async removeYear(id: string) {
    // Step 1: Check if the year exists
    const year = await this.prisma.year.findUnique({
      where: {
        id,
      },
      include: {
        CoursesOfYear: {
          include: {
            course: {
              include: {
                lessons: true, // Include lessons to delete them later
              },
            },
          },
        },
      },
    });

    // Step 2: If the year does not exist, throw an exception
    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    // Step 3: Delete all related lessons for each course
    for (const courseOfYear of year.CoursesOfYear) {
      await this.prisma.lesson.deleteMany({
        where: {
          courseId: courseOfYear.courseId,
        },
      });
    }

    // Step 4: Delete all related CoursesOfYear
    await this.prisma.coursesOfYear.deleteMany({
      where: {
        yearId: id,
      },
    });

    // Step 5: Delete all courses related to the year
    await this.prisma.course.deleteMany({
      where: {
        id: {
          in: year.CoursesOfYear.map((c) => c.courseId),
        },
      },
    });

    // Step 6: Delete the year
    await this.prisma.year.delete({
      where: {
        id,
      },
    });

    // Step 7: Return a success message
    return {
      message: 'تم حذف السنة والكورسات المتعلقة بها بنجاح',
    };
  }
  // End Year //////////////////////////////////////////////

  // Start Courses //////////////////////////////////////////////
  async createCourse(createCourseDto: CreateCourseDto, yearId: string) {
    const year = await this.prisma.year.findUnique({
      where: {
        id: yearId,
      },
    });

    console.log(createCourseDto);

    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    const course = await this.prisma.course.create({
      data: {
        name: createCourseDto.name,
        description: createCourseDto.description,
        image: createCourseDto.image,
        price: Number(createCourseDto.price),
        CoursesOfYear: {
          create: {
            year: {
              connect: {
                id: yearId,
              },
            },
          },
        },
      },
    });

    return {
      message: 'تم اضافة الكورس بنجاح',
    };
  }

  async findAllCoursesForAdmin(yearId: string) {
    const course = await this.prisma.course.findMany({
      where: {
        CoursesOfYear: {
          some: {
            yearId,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!course || course.length === 0) {
      throw new NotFoundException('لا يوجد كورسات متاحة');
    }

    return course;
  }

  async findOneCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    return course;
  }

  async changeIsActiveForCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        isActive: !course.isActive,
      },
    });

    return {
      message: 'تم تغيير حالة الكورس بنجاح',
    };
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        ...updateCourseDto,
      },
    });

    return {
      message: 'تم تحديث الكورس بنجاح',
    };
  }

  async removeCourse(id: string) {
    // Step 1: Check if the course exists
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        lessons: true, // Include lessons to delete them later
        CoursesOfYear: true, // Include CoursesOfYear to delete them later
      },
    });

    // Step 2: If the course does not exist, throw an exception
    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    // Step 3: Delete all related lessons
    await this.prisma.lesson.deleteMany({
      where: {
        courseId: id,
      },
    });

    // Step 4: Delete all related CoursesOfYear
    await this.prisma.coursesOfYear.deleteMany({
      where: {
        courseId: id,
      },
    });

    // Step 5: Delete the course
    await this.prisma.course.delete({
      where: {
        id,
      },
    });

    // Step 6: Return a success message
    return {
      message: 'تم حذف الكورس بنجاح',
    };
  }
  // End Course //////////////////////////////////////////////

  // Start Lesson //////////////////////////////////////////////
  async createLesson(createLessonDto: CreateLessonDto, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('الكورس غير موجود');
    }

    // Create the lesson
    const lesson = await this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        course: {
          connect: {
            id: courseId,
          },
        },
        ...(createLessonDto.video && {
          video: {
            createMany: {
              data: createLessonDto.video.map((video) => ({
                name: video.name,
                url: video.url,
                description: video.description,
              })),
            },
          },
        }),
      },
      include: {
        pdf: true,
        video: true,
      },
    });

    return {
      message: 'تم اضافة الدرس بنجاح',
      lesson, // Optionally return the created lesson with videos
    };
  }

  async addVideo(lessonId: string, createVideoDto: CreateVideoDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    const video = await this.prisma.video.create({
      data: {
        name: createVideoDto.name,
        url: createVideoDto.url,
        description: createVideoDto.description,
        lessonId,
      },
    });

    return {
      message: 'تم اضافة الفيديو بنجاح',
    };
  }

  async getSingleVideo(id: string) {
    const video = await this.prisma.video.findUnique({
      where: {
        id,
      },
    });

    if (!video) {
      throw new NotFoundException('الفيديو غير موجود');
    }

    return video;
  }

  async updateVideo(id: string, updateVideoDto: UpdateVideoDto) {
    const video = await this.prisma.video.findUnique({
      where: {
        id,
      },
    });

    if (!video) {
      throw new NotFoundException('الفيديو غير موجود');
    }

    await this.prisma.video.update({
      where: {
        id,
      },
      data: {
        ...updateVideoDto,
      },
    });

    return {
      message: 'تم تحديث الفيديو بنجاح',
    };
  }

  async findAllVideosLessonForAdmin(lessonId: string) {
    const lesson = await this.prisma.video.findMany({
      where: {
        lessonId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!lesson || lesson.length === 0) {
      throw new NotFoundException('لا يوجد فيديوهات متاحة');
    }

    return lesson;
  }

  async deleteVideo(id: string) {
    const video = await this.prisma.video.findUnique({
      where: {
        id,
      },
    });

    if (!video) {
      throw new NotFoundException('الدرس غير موجود');
    }

    await this.prisma.video.delete({
      where: {
        id,
      },
    });

    return {
      message: 'تم حذف الفيديو بنجاح',
    };
  }

  async deletePdf(id: string) {
    const pdf = await this.prisma.pdf.findUnique({
      where: {
        id,
      },
    });

    if (!pdf) {
      throw new NotFoundException('الدرس غير موجود');
    }

    await this.prisma.pdf.delete({
      where: {
        id,
      },
    });

    return {
      message: 'تم حذف الدرس بنجاح',
    };
  }

  async addPdf(lessonId: string, createPdfDto: CreatePdfDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    const pdf = await this.prisma.pdf.create({
      data: {
        name: createPdfDto.name,
        url: createPdfDto.url,
        lessonId: lessonId,
      },
    });

    return {
      message: 'تم اضافة الملف بنجاح',
    };
  }

  async getPfd(lessonId: string) {
    const pdf = await this.prisma.pdf.findMany({
      where: {
        lessonId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!pdf) {
      throw new NotFoundException('لا يوجد ملفات لهذا الدرس');
    }

    return pdf;
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    // Update lesson details
    const updatedLesson = await this.prisma.lesson.update({
      where: {
        id,
      },
      data: {
        name: updateLessonDto.name,
        description: updateLessonDto.description,
        image: updateLessonDto.image,
      },
    });

    return {
      message: 'تم تحديث الدرس بنجاح',
    };
  }

  async removeLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      include: {
        pdf: true, // Include PDFs to get their IDs
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود بالفعل');
    }

    // Delete associated PDFs if they exist
    if (lesson?.pdf.length > 0) {
      await this.prisma.pdf.deleteMany({
        where: {
          lessonId: id, // Assuming lessonId is the foreign key in Pdf table
        },
      });
    }

    // Now delete the lesson
    await this.prisma.lesson.delete({
      where: {
        id,
      },
    });

    return {
      message: 'تم حذف الدرس بنجاح',
    };
  }

  async changePublishedForLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }

    await this.prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isFree: !lesson.isFree,
      },
    });

    return {
      message: 'تم تغيير حالة الدرس بنجاح',
    };
  }
  // End Lesson //////////////////////////////////////////////
}
