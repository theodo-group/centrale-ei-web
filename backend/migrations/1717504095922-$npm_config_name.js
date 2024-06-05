import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717504095922 {
    name = ' $npmConfigName1717504095922'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
