import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createCooperativa(input: {
    email: string;
    password: string;
    standId: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const stand = await this.prisma.stand.findUnique({
      where: { id: input.standId },
    });
    if (!stand) {
      throw new BadRequestException('Stand no encontrado');
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashed,
        role: Role.COOPERATIVA,
        standId: input.standId,
      },
    });

    const { password, ...rest } = user;
    return rest;
  }

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


