import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717591948855 {
    name = ' $npmConfigName1717591948855'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "genre_name" varchar NOT NULL,
                CONSTRAINT "UQ_35a95dd11ad0db6e9684ca50df0" UNIQUE ("genre_name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "genre_movies_movie" (
                "genreId" integer NOT NULL,
                "movieId" integer NOT NULL,
                PRIMARY KEY ("genreId", "movieId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("id", "title", "release_date")
            SELECT "id",
                "title",
                "release_date"
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
            DROP INDEX "IDX_dff457c114a6294863814818b0"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e59764a417d4f8291747b744fa"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_genre_movies_movie" (
                "genreId" integer NOT NULL,
                "movieId" integer NOT NULL,
                CONSTRAINT "FK_dff457c114a6294863814818b0f" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("genreId", "movieId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_genre_movies_movie"("genreId", "movieId")
            SELECT "genreId",
                "movieId"
            FROM "genre_movies_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "genre_movies_movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_genre_movies_movie"
                RENAME TO "genre_movies_movie"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                CONSTRAINT "FK_985216b45541c7e0ec644a8dd4e" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_1996ce31a9e067304ab168d6715" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie_genres_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genres_genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie_genres_genre"
                RENAME TO "movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie_genres_genre"
                RENAME TO "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie_genres_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e59764a417d4f8291747b744fa"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_dff457c114a6294863814818b0"
        `);
        await queryRunner.query(`
            ALTER TABLE "genre_movies_movie"
                RENAME TO "temporary_genre_movies_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "genre_movies_movie" (
                "genreId" integer NOT NULL,
                "movieId" integer NOT NULL,
                PRIMARY KEY ("genreId", "movieId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "genre_movies_movie"("genreId", "movieId")
            SELECT "genreId",
                "movieId"
            FROM "temporary_genre_movies_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_genre_movies_movie"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId")
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("id", "title", "release_date")
            SELECT "id",
                "title",
                "release_date"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e59764a417d4f8291747b744fa"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_dff457c114a6294863814818b0"
        `);
        await queryRunner.query(`
            DROP TABLE "genre_movies_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
    }
}
