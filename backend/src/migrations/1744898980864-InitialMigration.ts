import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1744898980864 implements MigrationInterface {
    name = 'InitialMigration1744898980864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying, "isAdmin" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "lastLogin" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying(255) NOT NULL, "description" character varying, "responsibleName" character varying NOT NULL, "contactEmail" character varying NOT NULL, "contactPhone" character varying, "isActive" boolean NOT NULL DEFAULT true, "managedEquipmentTypes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "status" character varying(255) NOT NULL DEFAULT 'ACTIVE', "leadName" character varying, "leadContact" character varying, "memberCount" integer NOT NULL, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastActiveDate" date, "metadata" jsonb, "equipmentType" character varying(255), "departmentId" uuid NOT NULL, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "site" ("id" character varying NOT NULL, "name" character varying NOT NULL, "region" character varying NOT NULL, "zone" character varying, "longitude" numeric(10,6) NOT NULL, "latitude" numeric(10,6) NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'ACTIVE', "oldBase" character varying, "newBase" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" character varying NOT NULL, "type" character varying(255) NOT NULL, "model" character varying NOT NULL, "manufacturer" character varying, "serialNumber" character varying, "installDate" date NOT NULL, "lastMaintenanceDate" date, "status" character varying(255) NOT NULL DEFAULT 'ACTIF', "specifications" jsonb, "siteId" character varying NOT NULL, "departmentId" uuid, CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."equipment_type_enum" AS ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ')`);
        await queryRunner.query(`CREATE TABLE "specifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "equipmentType" "public"."equipment_type_enum" NOT NULL, "columns" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_621aabf71e640ab86f0e8b62a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_sites" ("teamId" character varying NOT NULL, "siteId" character varying NOT NULL, CONSTRAINT "PK_6d0f214327cdd4f34ea69d71283" PRIMARY KEY ("teamId", "siteId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_972a4c610bd5d70636bb6bcebc" ON "team_sites" ("teamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17ba2bac60175ce05c19a64395" ON "team_sites" ("siteId") `);
        await queryRunner.query(`CREATE TABLE "team_equipment" ("equipmentId" character varying NOT NULL, "teamId" character varying NOT NULL, CONSTRAINT "PK_375341a8bbe9711958b03e9746b" PRIMARY KEY ("equipmentId", "teamId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88adeb8c2648273c2e6084f93d" ON "team_equipment" ("equipmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d79e658657450532ad5473fc28" ON "team_equipment" ("teamId") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_bd5ee5dab94afcc03153c9c6cc2" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_c44fb857367306679c0722ee0e5" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_48739cb24cb61249c8dfa7a0489" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_sites" ADD CONSTRAINT "FK_972a4c610bd5d70636bb6bcebc3" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_sites" ADD CONSTRAINT "FK_17ba2bac60175ce05c19a643952" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_equipment" ADD CONSTRAINT "FK_88adeb8c2648273c2e6084f93d6" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_equipment" ADD CONSTRAINT "FK_d79e658657450532ad5473fc281" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_equipment" DROP CONSTRAINT "FK_d79e658657450532ad5473fc281"`);
        await queryRunner.query(`ALTER TABLE "team_equipment" DROP CONSTRAINT "FK_88adeb8c2648273c2e6084f93d6"`);
        await queryRunner.query(`ALTER TABLE "team_sites" DROP CONSTRAINT "FK_17ba2bac60175ce05c19a643952"`);
        await queryRunner.query(`ALTER TABLE "team_sites" DROP CONSTRAINT "FK_972a4c610bd5d70636bb6bcebc3"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_48739cb24cb61249c8dfa7a0489"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_c44fb857367306679c0722ee0e5"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_bd5ee5dab94afcc03153c9c6cc2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d79e658657450532ad5473fc28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88adeb8c2648273c2e6084f93d"`);
        await queryRunner.query(`DROP TABLE "team_equipment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17ba2bac60175ce05c19a64395"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_972a4c610bd5d70636bb6bcebc"`);
        await queryRunner.query(`DROP TABLE "team_sites"`);
        await queryRunner.query(`DROP TABLE "specifications"`);
        await queryRunner.query(`DROP TYPE "public"."equipment_type_enum"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TABLE "site"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
