import { GameOdds } from './dto/game-odds.interface';

export class SheetFormatter {
  static format(data: GameOdds[]): (string | number)[][] {
    return [
      ['Start Time', 'Home Team', 'Away Team', 'Bookmaker', 'Market', 'Outcome', 'Price'],
      ...data.map(({ startTime, homeTeam, awayTeam, bookmaker, market, outcome, price }) => {
        const date = new Date(startTime);
        const startTimeISO = isNaN(date.getTime()) ? '' : date.toISOString();

        return [
          startTimeISO,
          homeTeam,
          awayTeam,
          bookmaker || '',
          market || '',
          outcome || '',
          price != null ? price.toString() : '',
        ];
      }),
    ];
  }
}