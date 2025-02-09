import { IsIn, IsNumber, IsString, ValidateNested } from 'class-validator';
import { plainToClass, Type } from 'class-transformer';
import { DatabaseConfig } from './configs/database.config';
import * as process from 'node:process';

export class Environment {
  @IsString()
  EQHUB_KEY = process.env.EQHUB_KEY;
  @IsIn(['production', 'test', 'development'])
  NODE_ENV = process.env.NODE_ENV as 'production' | 'test' | 'development';

  @IsString()
  ACCOUNT_ID = process.env.ACCOUNT_ID;

  @IsString()
  EQ_API = process.env.EQ_ENDPOINT;

  @IsString()
  META_ADDRESS = process.env.META_ADDRESS;

  @IsString()
  SERVICE_NAME = process.env.SERVICE_NAME;

  @IsString()
  SERVICE_VERSION = process.env.SERVICE_VERSION;

  @Type(() => Number)
  @IsNumber()
  SERVER_PORT = process.env?.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3010;

  @IsString()
  COMPANY_NETWORK = process.env?.COMPANY_NETWORK
    ? process.env?.COMPANY_NETWORK
    : '115.93.255.204';

  @IsIn(['feature', 'stage', 'production'])
  SERVER_ENVIRONMENT_ID = process.env.SERVER_ENVIRONMENT_ID as
    | 'feature'
    | 'stage'
    | 'production';

  @ValidateNested()
  @Type(() => DatabaseConfig)
  DB_1: DatabaseConfig = plainToClass(DatabaseConfig, {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
  });
}
