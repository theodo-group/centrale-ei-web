import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717661518156 {
    name = ' $npmConfigName1717661518156'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal(10, 2) NOT NULL DEFAULT (0)
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "name",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "name",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" float NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "name",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "name",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity"
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
                "name" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal(10, 2) NOT NULL DEFAULT (0)
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "name",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "name",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal(10, 2) NOT NULL DEFAULT (0)
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "name",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity"
                )
            SELECT "id",
                "name",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
