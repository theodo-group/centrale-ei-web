/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class $npmConfigName1749122881289 {
    name = ' $npmConfigName1749122881289'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "ratings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "rating" integer NOT NULL,
                "comment" varchar
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "ratings"
        `);
    }
}
