"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixTeamEquipmentType1744288724189 = void 0;
class FixTeamEquipmentType1744288724189 {
    constructor() {
        this.name = 'FixTeamEquipmentType1744288724189';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN IF EXISTS \`equipmentType\``);
        await queryRunner.query(`
            ALTER TABLE \`team\` 
            ADD COLUMN \`equipmentType\` ENUM(
                'ANTENNE',
                'ROUTEUR',
                'BATTERIE',
                'GÉNÉRATEUR',
                'REFROIDISSEMENT',
                'SHELTER',
                'PYLÔNE',
                'SÉCURITÉ'
            ) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`equipmentType\``);
    }
}
exports.FixTeamEquipmentType1744288724189 = FixTeamEquipmentType1744288724189;
//# sourceMappingURL=1744288724189-FixTeamEquipmentType.js.map