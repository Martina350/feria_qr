import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QrsService } from './qrs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('qrs')
export class QrsController {
  constructor(private readonly qrsService: QrsService) {}

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkCreate(@Body() body: { codes: string[] }) {
    return this.qrsService.createBulk(body.codes ?? []);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAvailable() {
    return this.qrsService.findAvailable();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.qrsService.findAll();
  }
}


