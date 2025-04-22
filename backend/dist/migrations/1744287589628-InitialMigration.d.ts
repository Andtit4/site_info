import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitialMigration1744287589628 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
