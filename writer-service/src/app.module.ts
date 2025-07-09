import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validate: (config: Record<string, unknown>) => {
      const validatedConfig = plainToInstance(AppConfig, config, {
        enableImplicitConversion: true,
      });

      const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
      });

      if (errors.length > 0) {
        throw new Error(errors.toString());
      }

      return validatedConfig;
    },
  }), GoogleSheetsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
