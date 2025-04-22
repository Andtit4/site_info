"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1744287342271 = void 0;
class InitialMigration1744287342271 {
    constructor() {
        this.name = 'InitialMigration1744287342271';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` MODIFY \`equipmentType\` enum('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`createdAt\` \`createdAt\` varchar(255) NOT NULL DEFAULT '2025-04-10T12:15:54.814Z'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`createdAt\` \`createdAt\` varchar(255) NOT NULL DEFAULT '2025-04-10T10:45:38.303Z'`);
        await queryRunner.query(`ALTER TABLE \`team\` MODIFY \`equipmentType\` varchar(255) NULL`);
    }
}
exports.InitialMigration1744287342271 = InitialMigration1744287342271;
//# sourceMappingURL=1744287342271-InitialMigration.js.map