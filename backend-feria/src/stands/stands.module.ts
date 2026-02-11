import { Module } from '@nestjs/common';
import { StandsService } from './stands.service';
import { StandsController } from './stands.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StandsController],
  providers: [StandsService],
})
export class StandsModule {}


