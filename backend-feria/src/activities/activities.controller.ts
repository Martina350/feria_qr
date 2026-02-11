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
    @Body()
    body: {
      qrCodeId: string;
      standId: string;
      contentType:
        | 'AHORRO'
        | 'FRAUDE'
        | 'CREDITO'
        | 'PRESUPUESTO'
        | 'INVERSION'
        | 'SEGUROS';
    },
    @Req() req: { user: JwtPayload },
  ) {
    const standId = req.user?.standId;

    // Seguridad: el standId siempre viene del usuario autenticado, no del body.
    return this.activitiesService.completeActivity({
      qrCodeId: body.qrCodeId,
      standId,
      contentType: body.contentType,
      completedBy: req.user?.email,
    });
  }
}


