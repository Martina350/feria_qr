import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async registerStudent(input: {
    firstName: string;
    lastName: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    unitEducation: string;
    city: string;
    province: string;
    qrCodeId: string;
  }) {
    const qr = await this.prisma.qRCode.findUnique({
      where: { id: input.qrCodeId },
    });

    if (!qr || qr.status !== 'DISPONIBLE') {
      throw new BadRequestException('QR no disponible para asignación');
    }

    const student = await this.prisma.student.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        age: input.age,
        gender: input.gender,
        unitEducation: input.unitEducation,
        city: input.city,
        province: input.province,
        qrCodeId: input.qrCodeId,
      },
    });

    await this.prisma.qRCode.update({
      where: { id: input.qrCodeId },
      data: {
        status: 'ASIGNADO',
        assignedAt: new Date(),
      },
    });

    return student;
  }

  async getCompletionStatus(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        activities: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      isCompleted: student.isCompleted,
      completedAt: student.completedAt,
      activitiesCount: student.activities.length,
    };
  }
}


