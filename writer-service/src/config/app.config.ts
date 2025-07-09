import { IsString, IsNotEmpty } from 'class-validator';

export const SHEET_RANGE = 'Sheet1!A1';

export class AppConfig {
    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_SERVICE_ACCOUNT_CREDENTIALS: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_SHEET_ID: string;
}