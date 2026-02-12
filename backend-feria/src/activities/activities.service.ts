import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async completeActivity(input: {
    qrCodeId: string;
    standId?: string | null;
    contentType:
      | 'AHORRO'
      | 'FRAUDE'
      | 'CREDITO'
      | 'PRESUPUESTO'
      | 'INVERSION'
      | 'SEGUROS';
    completedBy?: string;
  }) {
    const qr = await this.findQrByIdOrCode(input.qrCodeId);

    if (!qr || qr.status !== 'ASIGNADO' || !qr.student) {
      throw new BadRequestException('QR no válido o no asignado a estudiante');
    }

    const studentId = qr.student.id;

    if (!input.standId) {
      throw new BadRequestException('El stand asociado al usuario no es válido');
    }

    await this.prisma.activityCompletion.create({
      data: {
        studentId,
        standId: input.standId,
        contentType: input.contentType,
        completedBy: input.completedBy,
      },
    });

    // Evaluar lógica de finalización (gamificación)
    await this.evaluateCompletion(studentId);

    return { success: true };
  }

  private async findQrByIdOrCode(idOrCode: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    return this.prisma.qRCode.findFirst({
      where: isUuid ? { id: idOrCode } : { code: idOrCode },
      include: { student: true },
    });
  }

  private async evaluateCompletion(studentId: string) {
    // Regla 1: completó todos los stands obligatorios
    const mandatoryStands = await this.prisma.stand.findMany({
      where: { isMandatory: true },
      select: { id: true },
    });

    const mandatoryStandIds = mandatoryStands.map((s) => s.id);

    let completedAllMandatoryStands = false;

    if (mandatoryStandIds.length > 0) {
      const completionsOnMandatory =
        await this.prisma.activityCompletion.groupBy({
          by: ['standId'],
          where: {
            studentId,
            standId: { in: mandatoryStandIds },
          },
        });

      const completedStandIds = completionsOnMandatory.map((c) => c.standId);
      completedAllMandatoryStands = mandatoryStandIds.every((id) =>
        completedStandIds.includes(id),
      );
    }

    // Regla 2: completó todos los tipos de contenido obligatorios
    const contentsOnStudent = await this.prisma.activityCompletion.groupBy({
      by: ['contentType'],
      where: { studentId },
    });

    const completedContentTypes = contentsOnStudent.map((c) => c.contentType);

    const allContentTypes: string[] = [
      'AHORRO',
      'FRAUDE',
      'CREDITO',
      'PRESUPUESTO',
      'INVERSION',
      'SEGUROS',
    ];

    const completedAllContentTypes = allContentTypes.every((ct) =>
      completedContentTypes.includes(ct as any),
    );

    const isCompleted = completedAllMandatoryStands || completedAllContentTypes;

    if (isCompleted) {
      await this.prisma.student.update({
        where: { id: studentId },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }
  }
}


