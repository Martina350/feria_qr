import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ContentType, Role } from '@prisma/client';

async function seedAdmin(prisma: PrismaService) {
  const email = process.env.ADMIN_EMAIL ?? 'admin@feria.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: Role.ADMIN,
    },
  });
}

async function seedStands(prisma: PrismaService) {
  const count = await prisma.stand.count();
  if (count > 0) return;

  const stands = [
    { name: 'Stand Ahorro', cooperativeName: 'Cooperativa Ahorro', contentType: ContentType.AHORRO, isMandatory: true },
    { name: 'Stand Fraude', cooperativeName: 'Cooperativa Fraude', contentType: ContentType.FRAUDE, isMandatory: true },
    { name: 'Stand Crédito', cooperativeName: 'Cooperativa Crédito', contentType: ContentType.CREDITO, isMandatory: false },
    { name: 'Stand Presupuesto', cooperativeName: 'Cooperativa Presupuesto', contentType: ContentType.PRESUPUESTO, isMandatory: false },
    { name: 'Stand Inversión', cooperativeName: 'Cooperativa Inversión', contentType: ContentType.INVERSION, isMandatory: false },
    { name: 'Stand Seguros', cooperativeName: 'Cooperativa Seguros', contentType: ContentType.SEGUROS, isMandatory: false },
  ];

  await prisma.stand.createMany({ data: stands });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  const prisma = app.get(PrismaService);
  await seedAdmin(prisma);
  await seedStands(prisma);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
