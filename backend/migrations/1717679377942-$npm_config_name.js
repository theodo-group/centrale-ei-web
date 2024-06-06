import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717679377942 {
    name = ' $npmConfigName1717679377942'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                CONSTRAINT "UQ_57da1a996e8be977ad91814ea75" UNIQUE ("id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path"
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
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "popularity" integer NOT NULL,
                "vote_average" integer NOT NULL,
                CONSTRAINT "UQ_57da1a996e8be977ad91814ea75" UNIQUE ("id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path"
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
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                CONSTRAINT "UQ_57da1a996e8be977ad91814ea75" UNIQUE ("id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path"
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
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "like" integer NOT NULL,
                CONSTRAINT "UQ_57da1a996e8be977ad91814ea75" UNIQUE ("id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
