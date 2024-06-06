import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717665616742 {
    name = ' $npmConfigName1717665616742'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal NOT NULL,
                "title" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity",
                    "title"
                )
            SELECT "id",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity",
                "title"
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
                "release_date" varchar,
                "backdrop_path" varchar,
                "poster_path" varchar,
                "description" varchar,
                "popularity" float,
                "title" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity",
                    "title"
                )
            SELECT "id",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity",
                "title"
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
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal NOT NULL,
                "title" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity",
                    "title"
                )
            SELECT "id",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity",
                "title"
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
                "release_date" varchar NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "description" varchar NOT NULL,
                "popularity" decimal NOT NULL,
                "title" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "release_date",
                    "backdrop_path",
                    "poster_path",
                    "description",
                    "popularity",
                    "title"
                )
            SELECT "id",
                "release_date",
                "backdrop_path",
                "poster_path",
                "description",
                "popularity",
                "title"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
