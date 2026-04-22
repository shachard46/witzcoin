import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserEmailFullName1745000000000 implements MigrationInterface {
  name = 'AddUserEmailFullName1745000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "fullName" character varying`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_email_partial" ON "user" ("email") WHERE "email" IS NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_email_partial"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "fullName"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "email"`)
  }
}
