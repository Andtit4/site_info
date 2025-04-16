import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManagedEquipmentTypes1744739627814 implements MigrationInterface {
    name = 'AddManagedEquipmentTypes1744739627814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`managedEquipmentTypes\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`managedEquipmentTypes\``);
    }
}
