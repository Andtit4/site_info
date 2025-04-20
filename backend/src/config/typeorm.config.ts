import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// Configuration codée en dur pour résoudre le problème SASL
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'andtit',
  password: 'motdepasse',
  database: 'site_info_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

// Fonction de configuration pour NestJS - même configuration codée en dur
export const typeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'andtit',
  password: 'motdepasse',
  database: 'site_info_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
}); 