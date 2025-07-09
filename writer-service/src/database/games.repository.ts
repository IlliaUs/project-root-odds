import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { PostgresService } from 'src/postgres/postgres.service';

const GET_GAMES_AND_ODDS_QUERY = `
      SELECT g.id, g."startTime", t1.name AS "homeTeam", t2.name AS "awayTeam", 
             o.bookmaker, o.market, o.outcome, o.price
      FROM "Game" g
      JOIN "Team" t1 ON g."homeTeamId" = t1.id
      JOIN "Team" t2 ON g."awayTeamId" = t2.id
      LEFT JOIN "Odd" o ON o."gameId" = g.id
      ORDER BY g."startTime" ASC
    `;

@Injectable()
export class GamesRepository {
  private readonly logger = new Logger(GamesRepository.name);

  constructor(private readonly postgresService: PostgresService) { }

  async getGamesAndOdds() {
    this.logger.log('Executing getGamesAndOdds query...');
    const client: Client = await this.postgresService.getClient();

    try {
      this.logger.log('About to execute Postgres query...');
      const res = await client.query(GET_GAMES_AND_ODDS_QUERY);
      return res.rows;
    } catch (error) {
      this.logger.error('Error executing getGamesAndOdds', error.stack);
      throw error;
    }
  }
}