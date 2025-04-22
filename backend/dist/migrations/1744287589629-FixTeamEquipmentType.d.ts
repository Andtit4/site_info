import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FixTeamEquipmentType1744287589629 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
