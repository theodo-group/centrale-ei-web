/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableMovieswithAllCriterias1749048573595 {
    name = 'CreateTableMovieswithAllCriterias1749048573595'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" ("title" varchar PRIMARY KEY NOT NULL)
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("title")
            SELECT "title"
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
                "title" varchar NOT NULL,
                "id" integer NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" varchar,
                "popularity" integer,
                "vote_average" integer,
                "vote_count" integer,
                "media_type" varchar,
                "tmdb_id" integer,
                "original_language" varchar,
                "original_title" varchar,
                "genre_ids" text,
                "backdrop_path" varchar,
                "adult" boolean DEFAULT (0),
                "video" boolean DEFAULT (0),
                CONSTRAINT "UQ_b3d41900d1b4729e33b691280e6" UNIQUE ("tmdb_id"),
                PRIMARY KEY ("title", "id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("title")
            SELECT "title"
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
                "title" varchar NOT NULL,
                "id" integer PRIMARY KEY NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" varchar,
                "popularity" integer,
                "vote_average" integer,
                "vote_count" integer,
                "media_type" varchar,
                "tmdb_id" integer,
                "original_language" varchar,
                "original_title" varchar,
                "genre_ids" text,
                "backdrop_path" varchar,
                "adult" boolean DEFAULT (0),
                "video" boolean DEFAULT (0),
                CONSTRAINT "UQ_b3d41900d1b4729e33b691280e6" UNIQUE ("tmdb_id"),
                CONSTRAINT "UQ_0e6a6ae9cd0961d172d4eaec9ce" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "title",
                    "id",
                    "release_date",
                    "poster_path",
                    "overview",
                    "popularity",
                    "vote_average",
                    "vote_count",
                    "media_type",
                    "tmdb_id",
                    "original_language",
                    "original_title",
                    "genre_ids",
                    "backdrop_path",
                    "adult",
                    "video"
                )
            SELECT "title",
                "id",
                "release_date",
                "poster_path",
                "overview",
                "popularity",
                "vote_average",
                "vote_count",
                "media_type",
                "tmdb_id",
                "original_language",
                "original_title",
                "genre_ids",
                "backdrop_path",
                "adult",
                "video"
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
                "title" varchar NOT NULL,
                "id" integer NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" varchar,
                "popularity" integer,
                "vote_average" integer,
                "vote_count" integer,
                "media_type" varchar,
                "tmdb_id" integer,
                "original_language" varchar,
                "original_title" varchar,
                "genre_ids" text,
                "backdrop_path" varchar,
                "adult" boolean DEFAULT (0),
                "video" boolean DEFAULT (0),
                CONSTRAINT "UQ_b3d41900d1b4729e33b691280e6" UNIQUE ("tmdb_id"),
                PRIMARY KEY ("title", "id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "title",
                    "id",
                    "release_date",
                    "poster_path",
                    "overview",
                    "popularity",
                    "vote_average",
                    "vote_count",
                    "media_type",
                    "tmdb_id",
                    "original_language",
                    "original_title",
                    "genre_ids",
                    "backdrop_path",
                    "adult",
                    "video"
                )
            SELECT "title",
                "id",
                "release_date",
                "poster_path",
                "overview",
                "popularity",
                "vote_average",
                "vote_count",
                "media_type",
                "tmdb_id",
                "original_language",
                "original_title",
                "genre_ids",
                "backdrop_path",
                "adult",
                "video"
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
            CREATE TABLE "movie" ("title" varchar PRIMARY KEY NOT NULL)
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("title")
            SELECT "title"
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
                "title" varchar PRIMARY KEY NOT NULL,
                "director" varchar NOT NULL,
                "description" varchar,
                "note" integer,
                "releaseDate" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("title")
            SELECT "title"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
