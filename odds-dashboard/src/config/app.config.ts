import { IsNotEmpty, IsString } from 'class-validator';

export class AppConfig {
  @IsString()
  @IsNotEmpty()
  ODDS_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  ODDS_API_BASE_URL: string;
}