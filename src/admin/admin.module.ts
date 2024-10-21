import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
