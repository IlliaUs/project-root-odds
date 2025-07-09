import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private client: Client;
  private connectPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.tryConnectWithRetries(5, 3000);
    } catch (err) {
      this.logger.warn('DATABASE_URL not provided or connection attempts failed — continuing without DB.');
    }
  }

  private async tryConnectWithRetries(maxAttempts: number, delayMs: number) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.connect();
        return;
      } catch (err) {
        this.logger.error(`Postgres connection attempt ${attempt} failed: ${err.message}`);
        if (attempt < maxAttempts) {
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    }
    throw new Error('All Postgres connection attempts failed');
  }

  private async connect() {
    if (!this.connectPromise) {
      this.connectPromise = (async () => {
        const connectionString = this.configService.getOrThrow<string>('DATABASE_URL');
        this.client = new Client({
          connectionString,
          connectionTimeoutMillis: 10000,
          statement_timeout: 30000,
        });
        await this.client.connect();
        this.logger.log('Connected to PostgreSQL');
      })();
    }
    return this.connectPromise;
  }

  async getClient(): Promise<Client> {
    if (!this.connectPromise) {
      throw new Error('PostgresService not initialized or connecting');
    }
    await this.connectPromise;
    return this.client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
      this.logger.log('Disconnected from PostgreSQL');
    }
  }
}