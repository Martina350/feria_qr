import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QrsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBulk(codes: string[]) {
    if (!codes.length) {
      return { created: 0 };
    }

    const data = codes.map((code) => ({ code }));

    const result = await this.prisma.qRCode.createMany({
      data,
      skipDuplicates: true,
    });

    return { created: result.count };
  }

  async findAvailable() {
    const qrs = await this.prisma.qRCode.findMany({
      where: { status: 'DISPONIBLE' },
      orderBy: { code: 'asc' },
    });

    return qrs;
  }

  async findAll() {
    return this.prisma.qRCode.findMany({
      orderBy: { code: 'asc' },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}


