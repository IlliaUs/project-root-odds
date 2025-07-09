import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OddsModule } from './odds/odds.module';
import { OddsService } from './odds/odds.service';
import { ConfigModule } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
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
    }),
    PrismaModule,
    OddsModule,
  ],
  controllers: [AppController],
  providers: [AppService, OddsService],
})
export class AppModule { }
