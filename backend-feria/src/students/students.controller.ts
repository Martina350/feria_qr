import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      age: number;
      gender: 'MALE' | 'FEMALE' | 'OTHER';
      unitEducation: string;
      city: string;
      province: string;
      qrCodeId: string;
    },
  ) {
    return this.studentsService.registerStudent(body);
  }

  @Get(':id/completion-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async completionStatus(@Param('id') id: string) {
    return this.studentsService.getCompletionStatus(id);
  }
}


