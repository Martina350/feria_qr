import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        standId: true,
        createdAt: true,
        stand: {
          select: { id: true, name: true, cooperativeName: true },
        },
      },
    });
    return users;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return this.findUserById(id);
  }

  async updateStand(id: string, standId: string | null) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (standId) {
      const stand = await this.prisma.stand.findUnique({ where: { id: standId } });
      if (!stand) {
        throw new BadRequestException('Stand no encontrado');
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: { standId },
    });

    return this.findUserById(id);
  }

  private findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        standId: true,
        stand: { select: { id: true, name: true, cooperativeName: true } },
      },
    });
  }
}


