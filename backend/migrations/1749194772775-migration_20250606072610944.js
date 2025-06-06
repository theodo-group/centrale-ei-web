/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migration202506060726109441749194772775 {
    name = 'Migration202506060726109441749194772775'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "User" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" integer NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "original_title" varchar,
                "overview" text,
                "release_date" datetime,
                "poster_path" varchar,
                "backdrop_path" varchar,
                "vote_average" float,
                "vote_count" integer,
                "popularity" float,
                "original_language" varchar,
                CONSTRAINT "UQ_title_releaseDate" UNIQUE ("title", "release_date")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Genre" (
                "id" integer PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Movies_genres" (
                "MovieId" integer NOT NULL,
                "GenreId" integer NOT NULL,
                PRIMARY KEY ("MovieId", "GenreId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b5e3c9f304e62663f983907fc8" ON "Movies_genres" ("MovieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2a614aca9fb601316f82301f6b" ON "Movies_genres" ("GenreId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "value" integer NOT NULL,
                "userId" integer,
                "movieId" integer,
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId"),
                CONSTRAINT "FK_4d0b0e3a4c4af854d225154ba40" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            DROP INDEX "IDX_b5e3c9f304e62663f983907fc8"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_2a614aca9fb601316f82301f6b"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_Movies_genres" (
                "MovieId" integer NOT NULL,
                "GenreId" integer NOT NULL,
                CONSTRAINT "FK_b5e3c9f304e62663f983907fc82" FOREIGN KEY ("MovieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_2a614aca9fb601316f82301f6bb" FOREIGN KEY ("GenreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("MovieId", "GenreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_Movies_genres"("MovieId", "GenreId")
            SELECT "MovieId",
                "GenreId"
            FROM "Movies_genres"
        `);
        await queryRunner.query(`
            DROP TABLE "Movies_genres"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_Movies_genres"
                RENAME TO "Movies_genres"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b5e3c9f304e62663f983907fc8" ON "Movies_genres" ("MovieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2a614aca9fb601316f82301f6b" ON "Movies_genres" ("GenreId")
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX "IDX_2a614aca9fb601316f82301f6b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b5e3c9f304e62663f983907fc8"
        `);
        await queryRunner.query(`
            ALTER TABLE "Movies_genres"
                RENAME TO "temporary_Movies_genres"
        `);
        await queryRunner.query(`
            CREATE TABLE "Movies_genres" (
                "MovieId" integer NOT NULL,
                "GenreId" integer NOT NULL,
                PRIMARY KEY ("MovieId", "GenreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "Movies_genres"("MovieId", "GenreId")
            SELECT "MovieId",
                "GenreId"
            FROM "temporary_Movies_genres"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_Movies_genres"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2a614aca9fb601316f82301f6b" ON "Movies_genres" ("GenreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b5e3c9f304e62663f983907fc8" ON "Movies_genres" ("MovieId")
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
                CONSTRAINT "UNIQUE_USER_MOVIE" UNIQUE ("userId", "movieId")
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
            DROP INDEX "IDX_2a614aca9fb601316f82301f6b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b5e3c9f304e62663f983907fc8"
        `);
        await queryRunner.query(`
            DROP TABLE "Movies_genres"
        `);
        await queryRunner.query(`
            DROP TABLE "Genre"
        `);
        await queryRunner.query(`
            DROP TABLE "Movie"
        `);
        await queryRunner.query(`
            DROP TABLE "ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "User"
        `);
    }
}
