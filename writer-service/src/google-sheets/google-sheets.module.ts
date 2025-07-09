import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { GoogleSheetsController } from './google-sheets.controller';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { SheetsClient } from './sheets-client';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService, GoogleAuthService, SheetsClient],
  exports: [GoogleAuthService, SheetsClient, GoogleSheetsService],
})
export class GoogleSheetsModule { }