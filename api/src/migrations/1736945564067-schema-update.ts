import { MigrationInterface, QueryRunner } from "typeorm";
import { MentalState } from "../../../shared/enums/therapy.enum";

export class SchemaUpdate1736945564067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mentalStates = Object.values(MentalState);
    await queryRunner.query(`
          CREATE OR REPLACE FUNCTION create_conclusions_for_user()
          RETURNS TRIGGER AS $$
          DECLARE
            mentalStateValue conclusion_mentalstate_enum;
          BEGIN
            -- Loop through each mental state
            FOR mentalStateValue IN
              SELECT unnest(ARRAY[${mentalStates.map((state) => `'${state}'`).join(", ")}])
            LOOP
              -- Insert a new conclusion for each mental state, setting the value to 50
              INSERT INTO "conclusion" (user_uuid, mentalstate)
              VALUES (NEW.uuid, mentalStateValue);
            END LOOP;
    
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
          CREATE TRIGGER create_conclusions_after_insert
          AFTER INSERT ON "user"
          FOR EACH ROW
          EXECUTE FUNCTION create_conclusions_for_user();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TRIGGER IF EXISTS create_conclusions_after_insert ON "user";
        `);

    await queryRunner.query(`
          DROP FUNCTION IF EXISTS create_conclusions_for_user;
        `);
  }
}
