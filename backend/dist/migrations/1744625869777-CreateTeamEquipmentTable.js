"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamEquipmentTable1744625869777 = void 0;
class CreateTeamEquipmentTable1744625869777 {
    constructor() {
        this.name = 'CreateTeamEquipmentTable1744625869777';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS team_equipment (
                equipmentId varchar(36) NOT NULL,
                teamId varchar(36) NOT NULL,
                PRIMARY KEY (equipmentId, teamId),
                CONSTRAINT FK_team_equipment_equipment FOREIGN KEY (equipmentId) REFERENCES equipment(id) ON DELETE CASCADE,
                CONSTRAINT FK_team_equipment_team FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE INDEX IDX_team_equipment_equipmentId ON team_equipment(equipmentId)
        `);
        await queryRunner.query(`
            CREATE INDEX IDX_team_equipment_teamId ON team_equipment(teamId)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS team_equipment`);
    }
}
exports.CreateTeamEquipmentTable1744625869777 = CreateTeamEquipmentTable1744625869777;
//# sourceMappingURL=1744625869777-CreateTeamEquipmentTable.js.map