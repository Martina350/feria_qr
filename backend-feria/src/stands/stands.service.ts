import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';

@Injectable()
export class StandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stand.findMany({
      orderBy: { cooperativeName: 'asc' },
    });
  }

  async create(input: {
    name: string;
    cooperativeName: string;
    contentType: ContentType;
    isMandatory?: boolean;
  }) {
    return this.prisma.stand.create({
      data: {
        name: input.name,
        cooperativeName: input.cooperativeName,
        contentType: input.contentType,
        isMandatory: input.isMandatory ?? false,
      },
    });
  }

  async findById(id: string) {
    const stand = await this.prisma.stand.findUnique({
      where: { id },
    });
    if (!stand) {
      throw new BadRequestException('Stand no encontrado');
    }
    return stand;
  }
}


