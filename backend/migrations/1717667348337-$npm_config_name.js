import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717667348337 {
    name = ' $npmConfigName1717667348337'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
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
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path",
                    "like"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "like"
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
                "like" integer NOT NULL,
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
                    "poster_path",
                    "like"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "like"
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
                    "poster_path",
                    "like"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "like"
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
                CONSTRAINT "UQ_57da1a996e8be977ad91814ea75" UNIQUE ("id"),
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "release_date",
                    "original_language",
                    "overview",
                    "poster_path",
                    "like"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "like"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
