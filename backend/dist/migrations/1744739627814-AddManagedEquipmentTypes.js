"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddManagedEquipmentTypes1744739627814 = void 0;
class AddManagedEquipmentTypes1744739627814 {
    constructor() {
        this.name = 'AddManagedEquipmentTypes1744739627814';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`managedEquipmentTypes\` text NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`managedEquipmentTypes\``);
    }
}
exports.AddManagedEquipmentTypes1744739627814 = AddManagedEquipmentTypes1744739627814;
//# sourceMappingURL=1744739627814-AddManagedEquipmentTypes.js.map