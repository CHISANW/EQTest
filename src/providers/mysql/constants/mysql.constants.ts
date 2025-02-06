import { Config } from '../../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../domains/user/entites/user.entity';

export const MYSQL = {
  CONNECTION: {
    ...Config.getEnvironment().DB_1,
    entities: { User },
    synchronize: true,
    logging: false,
    timezone: 'Asia/Seoul',
  },
};

export const MYSQL_CONNECTION = [
  {
    name: 'connection',
    connection: MYSQL.CONNECTION,
  },
];

export const TypeOrmModules = MYSQL_CONNECTION.map((mySqlConnection) =>
  TypeOrmModule.forRootAsync({
    name: mySqlConnection.name,
    useFactory: () => mySqlConnection.connection,
  }),
);
