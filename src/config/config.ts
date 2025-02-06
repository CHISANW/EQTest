import { Environment } from './environment';
import { config as dotenvConfig } from 'dotenv';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class Config {
  private static instance: Environment;

  private static readonly logger = new Logger();

  private constructor() {}

  public static getEnvironment(): Environment {
    if (!Config.instance) {
      const envFilePath = '.env';
      dotenvConfig({ path: envFilePath });
      Config.instance = Config.validate(process.env);
      Config.instance = Object.freeze(Config.instance);
    }
    return Config.instance;
  }

  public static validate(config: Record<string, unknown>): Environment {
    const validatedConfig = plainToInstance(Environment, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      this.logger.error(
        'Server Initialize ENV Validation Error: Server Closed',
      );
      process.exit(1);
    }

    return validatedConfig;
  }
}
