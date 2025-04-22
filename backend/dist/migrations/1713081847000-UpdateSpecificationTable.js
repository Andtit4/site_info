"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecificationTable1713081847000 = void 0;
class UpdateSpecificationTable1713081847000 {
    constructor() {
        this.name = 'UpdateSpecificationTable1713081847000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`specifications\` DROP COLUMN \`tableDefinition\``);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`specifications\` ADD \`tableDefinition\` json NOT NULL`);
    }
}
exports.UpdateSpecificationTable1713081847000 = UpdateSpecificationTable1713081847000;
//# sourceMappingURL=1713081847000-UpdateSpecificationTable.js.map