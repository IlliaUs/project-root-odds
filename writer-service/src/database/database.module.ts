import { Module } from '@nestjs/common';
import { GamesRepository } from './games.repository';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  providers: [GamesRepository],
  exports: [GamesRepository],
})
export class DatabaseModule { }