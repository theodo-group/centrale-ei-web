/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class  $npmConfigName1749044007357 {
    name = ' $npmConfigName1749044007357'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("id", "title", "year")
            SELECT "id",
                "title",
                "year"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("id", "title", "year")
            SELECT "id",
                "title",
                "year"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
