import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  // Helper opcional para habilitar shutdown hooks desde main.ts
  async enableShutdownHooks(app: INestApplication): Promise<void> {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}


