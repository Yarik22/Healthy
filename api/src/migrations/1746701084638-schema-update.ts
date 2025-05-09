import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import * as tests from "../assets/tests.json";

export class SchemaUpdate1746701084638 implements MigrationInterface {
  private static convertImageToBase64(imagePath: string | null): string | null {
    if (!imagePath) return null;
    const fullPath = path.resolve(__dirname, "..", imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    return imageBuffer.toString("base64");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const testData of tests) {
      const testImageBase64 = SchemaUpdate1746701084638.convertImageToBase64(
        testData.img
      );

      const testId = await queryRunner.query(
        `
          INSERT INTO "test"("uuid", "title", "description", "img")
          VALUES (uuid_generate_v4(), $1, $2, $3)
          RETURNING "uuid";
        `,
        [
          testData.title,
          testData.description || null,
          testImageBase64 ? `data:image/jpeg;base64,${testImageBase64}` : null,
        ]
      );

      const questionIds = [];
      for (const question of testData.questions) {
        const questionImageBase64 =
          SchemaUpdate1746701084638.convertImageToBase64(question.img);

        const questionId = await queryRunner.query(
          `
            INSERT INTO "question"("uuid", "title", "description", "img")
            VALUES (uuid_generate_v4(), $1, $2, $3)
            RETURNING "uuid";
          `,
          [
            question.title,
            question.description || null,
            questionImageBase64
              ? `data:image/jpeg;base64,${questionImageBase64}`
              : null,
          ]
        );

        for (const answer of question.answers) {
          const answerImageBase64 =
            SchemaUpdate1746701084638.convertImageToBase64(answer.img);

          await queryRunner.query(
            `
              INSERT INTO "answer"("uuid", "text", "mentalstate", "influence", "question_uuid", "img")
              VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5);
            `,
            [
              answer.text || null,
              answer.mentalState,
              answer.influence,
              questionId[0].uuid,
              answerImageBase64
                ? `data:image/jpeg;base64,${answerImageBase64}`
                : null,
            ]
          );
        }

        questionIds.push(questionId[0].uuid);
      }

      for (const questionId of questionIds) {
        await queryRunner.query(
          `
            INSERT INTO "test_question"("test_uuid", "question_uuid")
            VALUES ($1, $2);
          `,
          [testId[0].uuid, questionId]
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "test_question";');
    await queryRunner.query('DELETE FROM "answer";');
    await queryRunner.query('DELETE FROM "question";');
    await queryRunner.query('DELETE FROM "test";');
  }
}
