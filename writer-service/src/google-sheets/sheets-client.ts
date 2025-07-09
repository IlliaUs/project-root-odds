import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class SheetsClient {
  private sheetsApi: sheets_v4.Sheets | null = null;

  constructor(private readonly googleAuthService: GoogleAuthService) {}

  private async initSheetsApi() {
    if (!this.sheetsApi) {
      const authClient = await this.googleAuthService.getAuthClient();
      this.sheetsApi = google.sheets({ version: 'v4', auth: authClient });
    }
  }

  async updateValues(spreadsheetId: string, range: string, values: any[][]) {
    await this.initSheetsApi();
    return this.sheetsApi!.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
}