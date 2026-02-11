import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { Role } from '@prisma/client';

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  const prisma = app.get(PrismaService);
  await seedAdmin(prisma);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
