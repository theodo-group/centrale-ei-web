/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class CreateMovieTablewithGenre1749022225087 {
    name = 'CreateMovieTablewithGenre1749022225087'

    async up(queryRunner) {
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
                    "adult"
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
                "adult"
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
                    "adult"
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
                "adult"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
