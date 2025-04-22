"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEquipmentDepartmentRelation1712765178000 = void 0;
class UpdateEquipmentDepartmentRelation1712765178000 {
    constructor() {
        this.name = 'UpdateEquipmentDepartmentRelation1712765178000';
    }
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS equipment_departments`);
        const table = await queryRunner.getTable('equipment');
        const departmentIdColumn = table?.findColumnByName('departmentId');
        if (!departmentIdColumn) {
            await queryRunner.query(`ALTER TABLE equipment ADD COLUMN departmentId varchar(36) NULL`);
            await queryRunner.query(`
                ALTER TABLE equipment 
                ADD CONSTRAINT FK_equipment_department 
                FOREIGN KEY (departmentId) 
                REFERENCES department(id) 
                ON DELETE SET NULL
            `);
        }
        const teamTable = await queryRunner.getTable('team');
        const equipmentTypeColumn = teamTable?.findColumnByName('equipmentType');
        if (!equipmentTypeColumn) {
            await queryRunner.query(`
                ALTER TABLE team 
                ADD COLUMN equipmentType ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') DEFAULT NULL
            `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE equipment DROP FOREIGN KEY FK_equipment_department`);
        await queryRunner.query(`ALTER TABLE equipment DROP COLUMN departmentId`);
        await queryRunner.query(`ALTER TABLE team DROP COLUMN equipmentType`);
        await queryRunner.query(`
            CREATE TABLE equipment_departments (
                equipmentId varchar(36) NOT NULL,
                departmentId varchar(36) NOT NULL,
                PRIMARY KEY (equipmentId, departmentId),
                CONSTRAINT FK_equipment_departments_equipment 
                FOREIGN KEY (equipmentId) 
                REFERENCES equipment(id) 
                ON DELETE CASCADE,
                CONSTRAINT FK_equipment_departments_department 
                FOREIGN KEY (departmentId) 
                REFERENCES department(id) 
                ON DELETE CASCADE
            )
        `);
    }
}
exports.UpdateEquipmentDepartmentRelation1712765178000 = UpdateEquipmentDepartmentRelation1712765178000;
//# sourceMappingURL=1712765178000-UpdateEquipmentDepartmentRelation.js.map