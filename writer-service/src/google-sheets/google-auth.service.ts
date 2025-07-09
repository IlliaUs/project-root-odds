import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private readonly logger = new Logger(GoogleAuthService.name);
  private credentials: object;
  private authClient: any;
  private initialized = false;
  private readonly credentialsPath: string;

  constructor(private readonly configService: ConfigService) { this.credentialsPath = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS') || ''; }


  async onModuleInit() {
    await this.loadCredentials(this.credentialsPath);
  }

  async loadCredentials(path: string) {
    if (!path) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env variable is not set');
    }
    try {
      const content = await fs.readFile(path, 'utf8');
      this.credentials = JSON.parse(content);

      const auth = new google.auth.GoogleAuth({
        credentials: this.credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.authClient = await auth.getClient();
      this.initialized = true;
      this.logger.log('Google service account credentials loaded and client initialized');
    } catch (error) {
      this.logger.error('Failed to load Google credentials or initialize client', error);
      throw error;
    }
  }

  async getAuthClient() {
    if (!this.initialized) {
      await this.loadCredentials(this.credentialsPath);
    }
    return this.authClient;
  }
}

