import { MigrationInterface, QueryRunner } from "typeorm";
import * as therapies from "../assets/therapies.json";
import * as fs from "fs";
import * as path from "path";

export class SchemaUpdate1744961995174 implements MigrationInterface {
  private static convertImageToBase64(imagePath: string): string {
    const fullPath = path.resolve(__dirname, "..", imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    return imageBuffer.toString("base64");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const therapy of therapies) {
      const base64Image = SchemaUpdate1744961995174.convertImageToBase64(
        therapy.img
      );

      const data = {
        title: therapy.title.toLowerCase(),
        description: therapy.description,
        mentalStates: therapy.mentalStates,
        url: therapy.url,
        img: `data:image/jpeg;base64,${base64Image}`,
      };

      await queryRunner.query(
        `
            INSERT INTO therapy (title, description, "mentalstates", url, img)
            VALUES ($1, $2, $3, $4, $5)
        `,
        [data.title, data.description, data.mentalStates, data.url, data.img]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM therapy");
  }
}
