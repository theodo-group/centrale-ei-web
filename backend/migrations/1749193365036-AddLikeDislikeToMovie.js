/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
<<<<<<< HEAD:backend/migrations/1749048573595-CreateTableMovieswithAllCriterias.js
export default class CreateTableMovieswithAllCriterias1749048573595 {
    name = 'CreateTableMovieswithAllCriterias1749048573595'
=======
export default class AddLikeDislikeToMovie1749193365036 {
    name = 'AddLikeDislikeToMovie1749193365036'
>>>>>>> main:backend/migrations/1749193365036-AddLikeDislikeToMovie.js

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_genre" (
                "tmdb_id" integer PRIMARY KEY,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_50756f6d0d6409e31291644711b" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_genre"("tmdb_id", "name")
            SELECT "tmdb_id",
                "name"
            FROM "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_genre"
                RENAME TO "genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" varchar,
                "popularity" integer,
                "vote_average" integer,
                "vote_count" integer,
                "media_type" varchar,
                "tmdb_id" integer,
                "original_language" varchar,
                "backdrop_path" varchar,
                "adult" boolean DEFAULT (0),
                "genre_ids" text,
                "original_title" varchar,
                "video" boolean DEFAULT (0),
                "likedislike" integer DEFAULT (0),
                CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" UNIQUE ("tmdb_id"),
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "release_date",
                    "poster_path",
                    "overview",
                    "popularity",
                    "vote_average",
                    "vote_count",
                    "media_type",
                    "tmdb_id",
                    "original_language",
                    "backdrop_path",
                    "adult",
                    "genre_ids",
                    "original_title",
                    "video"
                )
            SELECT "id",
                "title",
                "release_date",
                "poster_path",
                "overview",
                "popularity",
                "vote_average",
                "vote_count",
                "media_type",
                "tmdb_id",
                "original_language",
                "backdrop_path",
                "adult",
                "genre_ids",
                "original_title",
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
        await queryRunner.query(`
            CREATE TABLE "temporary_genre" (
                "tmdb_id" integer PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_50756f6d0d6409e31291644711b" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_genre"("tmdb_id", "name")
            SELECT "tmdb_id",
                "name"
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
            CREATE TABLE "genre" (
                "tmdb_id" integer PRIMARY KEY,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_50756f6d0d6409e31291644711b" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "genre"("tmdb_id", "name")
            SELECT "tmdb_id",
                "name"
            FROM "temporary_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" varchar,
                "popularity" integer,
                "vote_average" integer,
                "vote_count" integer,
                "media_type" varchar,
                "tmdb_id" integer,
                "original_language" varchar,
                "backdrop_path" varchar,
                "adult" boolean DEFAULT (0),
                "genre_ids" text,
                "original_title" varchar,
                "video" boolean DEFAULT (0),
                CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" UNIQUE ("tmdb_id"),
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "release_date",
                    "poster_path",
                    "overview",
                    "popularity",
                    "vote_average",
                    "vote_count",
                    "media_type",
                    "tmdb_id",
                    "original_language",
                    "backdrop_path",
                    "adult",
                    "genre_ids",
                    "original_title",
                    "video"
                )
            SELECT "id",
                "title",
                "release_date",
                "poster_path",
                "overview",
                "popularity",
                "vote_average",
                "vote_count",
                "media_type",
                "tmdb_id",
                "original_language",
                "backdrop_path",
                "adult",
                "genre_ids",
                "original_title",
                "video"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "genre"
                RENAME TO "temporary_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "tmdb_id" integer PRIMARY KEY,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_50756f6d0d6409e31291644711b" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "genre"("tmdb_id", "name")
            SELECT "tmdb_id",
                "name"
            FROM "temporary_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_genre"
        `);
    }
}
