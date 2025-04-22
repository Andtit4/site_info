"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'site_info_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    charset: 'utf8mb4_unicode_ci',
});
const typeOrmConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: parseInt(configService.get('DATABASE_PORT', '3306'), 10),
    username: configService.get('DATABASE_USERNAME', 'root'),
    password: configService.get('DATABASE_PASSWORD', ''),
    database: configService.get('DATABASE_NAME', 'site_info_db'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    charset: 'utf8mb4_unicode_ci',
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map