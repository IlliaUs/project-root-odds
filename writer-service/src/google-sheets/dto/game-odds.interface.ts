export interface GameOdds {
    startTime: string | Date;
    homeTeam: string;
    awayTeam: string;
    bookmaker?: string;
    market?: string;
    outcome?: string;
    price?: number | null;
}