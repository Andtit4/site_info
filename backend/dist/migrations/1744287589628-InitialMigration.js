"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1744287589628 = void 0;
class InitialMigration1744287589628 {
    constructor() {
        this.name = 'InitialMigration1744287589628';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`equipmentType\` enum NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`createdAt\` \`createdAt\` varchar(255) NOT NULL DEFAULT '2025-04-10T12:20:08.411Z'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`createdAt\` \`createdAt\` varchar(255) NOT NULL DEFAULT '2025-04-10T10:45:38.303Z'`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`equipmentType\``);
    }
}
exports.InitialMigration1744287589628 = InitialMigration1744287589628;
//# sourceMappingURL=1744287589628-InitialMigration.js.map