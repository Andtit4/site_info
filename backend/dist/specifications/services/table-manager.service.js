"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TableManagerService = class TableManagerService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createTable(tableDefinition) {
        const { tableName, columns } = tableDefinition;
        const tableExists = await this.checkTableExists(tableName);
        if (tableExists) {
            await this.dropTable(tableName);
        }
        const columnDefinitions = columns.map(column => {
            let columnDefinition = `${column.name} ${column.type.toUpperCase()}`;
            if (column.length) {
                columnDefinition += `(${column.length})`;
            }
            if (column.nullable === false) {
                columnDefinition += ' NOT NULL';
            }
            if (column.defaultValue !== undefined) {
                columnDefinition += ` DEFAULT '${column.defaultValue}'`;
            }
            return columnDefinition;
        }).join(', ');
        const query = `CREATE TABLE ${tableName} (id VARCHAR(36) PRIMARY KEY, ${columnDefinitions})`;
        try {
            await this.dataSource.query(query);
        }
        catch (error) {
            console.error(`Erreur lors de la création de la table ${tableName}:`, error);
            throw error;
        }
    }
    async checkTableExists(tableName) {
        const query = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = '${tableName}'
    `;
        const result = await this.dataSource.query(query);
        return result[0].count > 0;
    }
    async dropTable(tableName) {
        const query = `DROP TABLE IF EXISTS ${tableName}`;
        await this.dataSource.query(query);
    }
};
exports.TableManagerService = TableManagerService;
exports.TableManagerService = TableManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], TableManagerService);
//# sourceMappingURL=table-manager.service.js.map