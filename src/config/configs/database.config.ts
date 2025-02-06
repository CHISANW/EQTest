import { IsIn, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DatabaseConfig {
  @IsIn(['mysql'])
  type: 'mysql';

  @IsString()
  host: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @Type(() => Number)
  @IsNumber()
  port: number;
}
