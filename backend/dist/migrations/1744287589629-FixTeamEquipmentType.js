"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixTeamEquipmentType1744287589629 = void 0;
class FixTeamEquipmentType1744287589629 {
    constructor() {
        this.name = 'FixTeamEquipmentType1744287589629';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`equipmentType\``);
        await queryRunner.query(`
            ALTER TABLE \`team\` 
            ADD COLUMN \`equipmentType\` ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`equipmentType\``);
    }
}
exports.FixTeamEquipmentType1744287589629 = FixTeamEquipmentType1744287589629;
//# sourceMappingURL=1744287589629-FixTeamEquipmentType.js.map