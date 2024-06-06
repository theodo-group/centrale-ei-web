import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717593529712 {
    name = ' $npmConfigName1717593529712'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "scoresId" integer,
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
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
                    "scoresId"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "scoresId"
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
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "scoresId" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "scoresId"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "scoresId"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
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
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"("id", "email", "firstname", "lastname")
            SELECT "id",
                "email",
                "firstname",
                "lastname"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_score" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "score" integer NOT NULL,
                "moviesId" integer,
                "usersId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_score"("id", "score")
            SELECT "id",
                "score"
            FROM "score"
        `);
        await queryRunner.query(`
            DROP TABLE "score"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_score"
                RENAME TO "score"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_score" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "score" integer NOT NULL,
                "moviesId" integer,
                "usersId" integer,
                CONSTRAINT "FK_a75bf7ebbde9d19819d00240731" FOREIGN KEY ("moviesId") REFERENCES "movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_f809ba06f8a61836a840bf00820" FOREIGN KEY ("usersId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_score"("id", "score", "moviesId", "usersId")
            SELECT "id",
                "score",
                "moviesId",
                "usersId"
            FROM "score"
        `);
        await queryRunner.query(`
            DROP TABLE "score"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_score"
                RENAME TO "score"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "score"
                RENAME TO "temporary_score"
        `);
        await queryRunner.query(`
            CREATE TABLE "score" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "score" integer NOT NULL,
                "moviesId" integer,
                "usersId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "score"("id", "score", "moviesId", "usersId")
            SELECT "id",
                "score",
                "moviesId",
                "usersId"
            FROM "temporary_score"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_score"
        `);
        await queryRunner.query(`
            ALTER TABLE "score"
                RENAME TO "temporary_score"
        `);
        await queryRunner.query(`
            CREATE TABLE "score" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "score" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "score"("id", "score")
            SELECT "id",
                "score"
            FROM "temporary_score"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_score"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "scoresId" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"("id", "email", "firstname", "lastname")
            SELECT "id",
                "email",
                "firstname",
                "lastname"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
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
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "scoresId" integer,
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
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "scoresId" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "FK_e3c3764920ed7d8478c46d61619" FOREIGN KEY ("scoresId") REFERENCES "score" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "scoresId"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "scoresId"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
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
                "original_language" varchar NOT NULL,
                "overview" varchar NOT NULL,
                "poster_path" varchar NOT NULL,
                "scoresId" integer,
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"),
                CONSTRAINT "FK_627eec582d2bffec64427e80212" FOREIGN KEY ("scoresId") REFERENCES "score" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
                    "scoresId"
                )
            SELECT "id",
                "title",
                "release_date",
                "original_language",
                "overview",
                "poster_path",
                "scoresId"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
