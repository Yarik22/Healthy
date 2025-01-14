import { Module } from '@nestjs/common';
import { TherapyService } from './therapy.service';
import { TherapyController } from './therapy.controller';

@Module({
  controllers: [TherapyController],
  providers: [TherapyService],
})
export class TherapyModule {}
