import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COOPERATIVA')
  async complete(
    @Body() body: { qrCodeId: string },
    @Req() req: { user: JwtPayload },
  ) {
    const standId = req.user?.standId;

    return this.activitiesService.completeActivity({
      qrCodeId: body.qrCodeId,
      standId: standId ?? undefined,
      completedBy: req.user?.email,
    });
  }
}


