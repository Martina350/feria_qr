import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body()
    body: {
      email: string;
      password: string;
      standId: string;
    },
  ) {
    return this.usersService.createCooperativa(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRole(
    @Param('id') id: string,
    @Body() body: { role: 'ADMIN' | 'COOPERATIVA' },
  ) {
    return this.usersService.updateRole(id, body.role as any);
  }

  @Patch(':id/stand')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateStand(
    @Param('id') id: string,
    @Body() body: { standId: string | null },
  ) {
    return this.usersService.updateStand(id, body.standId);
  }
}


