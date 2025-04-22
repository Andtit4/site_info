"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamSitesTable1710000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateTeamSitesTable1710000000000 {
    async up(queryRunner) {
        try {
            await queryRunner.query(`ALTER TABLE team_sites DROP FOREIGN KEY FK_972a4c610bd5d70636bb6bcebc3`);
        }
        catch (error) {
        }
        await queryRunner.query(`DROP TABLE IF EXISTS team_sites`);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'team_sites',
            columns: [
                {
                    name: 'teamId',
                    type: 'varchar',
                    length: '36',
                    isPrimary: true,
                },
                {
                    name: 'siteId',
                    type: 'varchar',
                    length: '36',
                    isPrimary: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('team_sites', new typeorm_1.TableForeignKey({
            columnNames: ['teamId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'team',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('team_sites', new typeorm_1.TableForeignKey({
            columnNames: ['siteId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'site',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('team_sites');
        const foreignKeys = table.foreignKeys;
        await Promise.all(foreignKeys.map(foreignKey => queryRunner.dropForeignKey('team_sites', foreignKey)));
        await queryRunner.dropTable('team_sites');
    }
}
exports.CreateTeamSitesTable1710000000000 = CreateTeamSitesTable1710000000000;
//# sourceMappingURL=1710000000000-CreateTeamSitesTable.js.map