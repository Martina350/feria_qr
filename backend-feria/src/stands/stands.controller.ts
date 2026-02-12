import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { StandsService } from './stands.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stands')
export class StandsController {
  constructor(private readonly standsService: StandsService) {}

  @Get()
  async findAll() {
    return this.standsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body()
    body: {
      name: string;
      cooperativeName: string;
      contentType: 'AHORRO' | 'FRAUDE' | 'CREDITO' | 'PRESUPUESTO' | 'INVERSION' | 'SEGUROS';
      isMandatory?: boolean;
    },
  ) {
    return this.standsService.create({
      name: body.name,
      cooperativeName: body.cooperativeName,
      contentType: body.contentType,
      isMandatory: body.isMandatory,
    });
  }
}


