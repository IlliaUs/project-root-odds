import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule {}