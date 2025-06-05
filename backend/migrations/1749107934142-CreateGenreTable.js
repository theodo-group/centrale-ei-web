/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class CreateGenreTable1749107934142 {
    name = 'CreateGenreTable1749107934142'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_genre" (
                "tmdb_id" integer PRIMARY KEY,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_50756f6d0d6409e31291644711b" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_genre"("tmdb_id")
            SELECT "tmdb_id"
            FROM "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_genre"
                RENAME TO "genre"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "genre"
                RENAME TO "temporary_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "genre" ("tmdb_id" integer PRIMARY KEY)
        `);
        await queryRunner.query(`
            INSERT INTO "genre"("tmdb_id")
            SELECT "tmdb_id"
            FROM "temporary_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_genre"
        `);
    }
}
