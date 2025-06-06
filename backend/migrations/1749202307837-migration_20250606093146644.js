/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migration202506060931466441749202307837 {
    name = 'Migration202506060931466441749202307837'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" integer NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId"),
                CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_ratings"("id", "value", "userId", "movieId")
            SELECT "id",
                "value",
                "userId",
                "movieId"
            FROM "ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "ratings"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_ratings"
                RENAME TO "ratings"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" float NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId"),
                CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_ratings"("id", "value", "userId", "movieId")
            SELECT "id",
                "value",
                "userId",
                "movieId"
            FROM "ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "ratings"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_ratings"
                RENAME TO "ratings"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "ratings"
                RENAME TO "temporary_ratings"
        `);
        await queryRunner.query(`
            CREATE TABLE "ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" integer NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId"),
                CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "ratings"("id", "value", "userId", "movieId")
            SELECT "id",
                "value",
                "userId",
                "movieId"
            FROM "temporary_ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_ratings"
        `);
        await queryRunner.query(`
            ALTER TABLE "ratings"
                RENAME TO "temporary_ratings"
        `);
        await queryRunner.query(`
            CREATE TABLE "ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" integer NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId"),
                CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "ratings"("id", "value", "userId", "movieId")
            SELECT "id",
                "value",
                "userId",
                "movieId"
            FROM "temporary_ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_ratings"
        `);
    }
}
