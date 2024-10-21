import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { YearsService } from './years.service';
import { CreateYearDto } from './dto/create-year.dto';
import { UpdateYearDto } from './dto/update-year.dto';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('years')
export class YearsController {
  constructor(private readonly yearsService: YearsService) {}

  @Get()
  findAllForUsers() {
    return this.yearsService.findAllForUser();
  }

  @Get(':id')
  findOneForUser(@Param('id') id: string) {
    return this.yearsService.findOneForUser(id);
  }
}
