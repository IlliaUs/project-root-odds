import { Module } from '@nestjs/common';
import { OddsService } from './odds.service';
import { OddsController } from './odds.controller';

@Module({
  providers: [OddsService],
  controllers: [OddsController]
})
export class OddsModule {}
