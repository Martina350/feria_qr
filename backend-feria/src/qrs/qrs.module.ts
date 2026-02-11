import { Module } from '@nestjs/common';
import { QrsController } from './qrs.controller';
import { QrsService } from './qrs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QrsController],
  providers: [QrsService],
})
export class QrsModule {}


