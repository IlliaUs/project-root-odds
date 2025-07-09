import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

import { GamesRepository } from 'src/database/games.repository';
import { SheetsClient } from './sheets-client';
import { SheetFormatter } from './sheet-formatter';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);


  constructor(

    private readonly gamesRepository: GamesRepository,
    private readonly sheetsClient: SheetsClient,
    private readonly configService: ConfigService,) { }


  async writeToSheet() {
    try {
      this.logger.log('Starting data write process...');

      const data = await this.getDataFromDb();
      const formattedValues = this.formatData(data);

      const { spreadsheetId, sheetRange } = this.getConfig();

      await this.sheetsClient.updateValues(spreadsheetId, sheetRange, formattedValues);

      this.logger.log('Data written to Google Sheets successfully');
    } catch (error) {
      this.logger.error(`Failed to write to Google Sheets: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getDataFromDb() {
    this.logger.log('Fetching data from database...');
    return this.gamesRepository.getGamesAndOdds();
  }

  private formatData(data: any) {
    return SheetFormatter.format(data);
  }

  private getConfig() {
    const spreadsheetId = this.configService.get<string>('GOOGLE_SHEET_ID');
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID env variable is not set');
    }
    const sheetRange = this.configService.get<string>('SHEET_RANGE') ?? 'Sheet1!A1';
    return { spreadsheetId, sheetRange };
  }
}