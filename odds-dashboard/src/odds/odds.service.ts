import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bookmaker } from './dto/odds.dto';

@Injectable()
export class OddsService {
    private readonly logger = new Logger(OddsService.name);

    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) { }

    async fetchAndStoreOdds() {
        try {
            const oddsData = await this.fetchOddsFromApi();

            for (const match of oddsData) {
                try {
                    const sport = await this.upsertSport(match.sport_title);
                    const homeTeam = await this.upsertTeam(match.home_team, sport.id);
                    const awayTeam = await this.upsertTeam(match.away_team, sport.id);
                    const game = await this.upsertGame(homeTeam.id, awayTeam.id, new Date(match.commence_time));
                    await this.replaceOddsForGame(game.id, match.bookmakers);
                } catch (matchError) {
                    this.logger.error(`Error processing match ${match.home_team} vs ${match.away_team}`, matchError.stack);
                }
            }

            return { message: 'Odds fetched and stored' };
        } catch (error) {
            this.logger.error('Error fetching odds from API', error.stack);
            throw error;
        }
    }

    private async fetchOddsFromApi() {
        try {
            const apiUrl = this.configService.get<string>('ODDS_API_BASE_URL')!;
            const apiKey = this.configService.get<string>('ODDS_API_KEY')!;
            const response = await axios.get(apiUrl, {
                params: {
                    regions: 'us',
                    markets: 'h2h',
                    oddsFormat: 'american',
                    apiKey: apiKey,
                },
            });
            return response.data;
        } catch (error) {
            this.logger.error('Failed to fetch odds from API', error.stack);
            throw error;
        }
    }

    private async upsertSport(name: string) {
        try {
            return await this.prisma.sport.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        } catch (error) {
            this.logger.error(`Failed to upsert sport: ${name}`, error.stack);
            throw error;
        }
    }

    private async upsertTeam(name: string, sportId: number) {
        try {
            return await this.prisma.team.upsert({
                where: { name },
                update: {},
                create: {
                    name,
                    sportId,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to upsert team: ${name}`, error.stack);
            throw error;
        }
    }

    private async upsertGame(homeTeamId: number, awayTeamId: number, startTime: Date) {
        try {
            return await this.prisma.game.upsert({
                where: {
                    homeTeamId_awayTeamId_startTime: {
                        homeTeamId,
                        awayTeamId,
                        startTime,
                    },
                },
                update: {},
                create: {
                    startTime,
                    homeTeamId,
                    awayTeamId,
                    status: 'scheduled',
                },
            });
        } catch (error) {
            this.logger.error(`Failed to upsert game: ${homeTeamId} vs ${awayTeamId} at ${startTime}`, error.stack);
            throw error;
        }
    }

    private async replaceOddsForGame(gameId: number, bookmakers: Bookmaker[]) {
        try {
            await this.prisma.odd.deleteMany({ where: { gameId } });

            const oddsToCreate: { bookmaker: string; market: string; outcome: string; price: number; gameId: number; }[] = [];

            for (const bookmaker of bookmakers) {
                for (const market of bookmaker.markets) {
                    for (const outcome of market.outcomes) {
                        oddsToCreate.push({
                            bookmaker: bookmaker.title,
                            market: market.key,
                            outcome: outcome.name,
                            price: outcome.price,
                            gameId,
                        });
                    }
                }
            }

            await this.prisma.odd.createMany({ data: oddsToCreate });
        } catch (error) {
            this.logger.error(`Failed to replace odds for gameId ${gameId}`, error.stack);
            throw error;
        }
    }
}
