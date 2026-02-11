import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StandsService {
  constructor(private readonly prisma: PrismaService) {}

  // Lógica de stands (configuración, métricas por cooperativa, etc.)
}


