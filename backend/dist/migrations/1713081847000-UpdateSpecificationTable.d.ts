import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdateSpecificationTable1713081847000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
