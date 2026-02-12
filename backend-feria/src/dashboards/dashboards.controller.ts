import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Controller('dashboard')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getEntries() {
    return this.dashboardsService.getEntriesDashboard();
  }

  @Get('stands')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getStands() {
    return this.dashboardsService.getStandsDashboard();
  }

  @Get('my-stand')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COOPERATIVA')
  async getMyStand(@Req() req: { user: JwtPayload }) {
    return this.dashboardsService.getMyStandDashboard(req.user.standId ?? '');
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async export() {
    return this.dashboardsService.exportData();
  }
}


