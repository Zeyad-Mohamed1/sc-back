import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateYearDto } from './dto/create-year.dto';
import { UpdateYearDto } from './dto/update-year.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class YearsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser() {
    const years = await this.prisma.year.findMany({
      where: {
        isActive: true,
      },
    });

    if (!years || years.length === 0) {
      throw new NotFoundException('لا يوجد سنين متاحة لعرضها');
    }

    return years;
  }

  async findOneForUser(id: string) {
    const year = await this.prisma.year.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!year) {
      throw new NotFoundException('السنة غير موجودة');
    }

    return year;
  }
}
