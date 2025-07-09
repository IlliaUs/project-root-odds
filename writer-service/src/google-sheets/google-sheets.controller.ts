import { Controller, Get } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';

@Controller('write-to-sheet')
export class GoogleSheetsController {
  constructor(private readonly sheetsService: GoogleSheetsService) { }

  @Get()
  async writeData() {
    try {
      const result = await this.sheetsService.writeToSheet();
      return { message: 'Data successfully written to Google Sheets', result };
    } catch (error) {
      throw error;
    }
  }
}
