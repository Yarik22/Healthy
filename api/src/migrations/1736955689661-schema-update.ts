import { MigrationInterface, QueryRunner } from "typeorm";
import { Constraints } from "../../shared/constraints/database.constraint";

export class SchemaUpdate1736955689661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_conclusion_value_after_result()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Handle INSERT, UPDATE, or DELETE for result table
        IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
          UPDATE conclusion
          SET value = LEAST(
              ${Constraints.Conclusion.value.max},  -- Cap the value at 100
              GREATEST(
                ${Constraints.Conclusion.value.min},  -- Ensure the value is at least 0
                (
                  SELECT COALESCE(SUM(a.influence), 0) + ${Constraints.Conclusion.defaultValue}
                  FROM result r
                  INNER JOIN answer a ON r.answer_uuid = a.uuid
                  WHERE r.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = NEW.answer_uuid LIMIT 1) 
                    AND LOWER(a.mentalstate::text) = LOWER(conclusion.mentalstate::text)
                )
              )
            )
          WHERE conclusion.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = NEW.answer_uuid LIMIT 1)
            AND LOWER(conclusion.mentalstate::text) = LOWER((SELECT mentalstate::text FROM answer WHERE uuid = NEW.answer_uuid));

        ELSIF (TG_OP = 'DELETE') THEN
          -- Handle DELETE operation by using OLD values
          UPDATE conclusion
          SET value = LEAST(
              ${Constraints.Conclusion.value.max},  -- Cap the value at 100
              GREATEST(
                ${Constraints.Conclusion.value.min},  -- Ensure the value is at least 0
                (
                  SELECT COALESCE(SUM(a.influence), 0) + ${Constraints.Conclusion.defaultValue}
                  FROM result r
                  INNER JOIN answer a ON r.answer_uuid = a.uuid
                  WHERE r.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = OLD.answer_uuid LIMIT 1)
                    AND LOWER(a.mentalstate::text) = LOWER(conclusion.mentalstate::text)
                )
              )
            )
          WHERE conclusion.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = OLD.answer_uuid LIMIT 1)
            AND LOWER(conclusion.mentalstate::text) = LOWER((SELECT mentalstate::text FROM answer WHERE uuid = OLD.answer_uuid));
        END IF;

        RETURN NULL;  -- For DELETE and UPDATE, the trigger will not affect the row itself.
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_conclusion_value_after_result
      AFTER INSERT OR UPDATE OR DELETE ON result
      FOR EACH ROW
      EXECUTE FUNCTION update_conclusion_value_after_result();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_conclusion_value_after_answer_influence()
      RETURNS TRIGGER AS $$
      BEGIN
        -- We are handling the UPDATE of influence in the answer table
        UPDATE conclusion
        SET value = LEAST(
            ${Constraints.Conclusion.value.max},  -- Cap the value at 100
            GREATEST(
              ${Constraints.Conclusion.value.min},  -- Ensure the value is at least 0
              (
                SELECT COALESCE(SUM(a.influence), 0) + ${Constraints.Conclusion.defaultValue}
                FROM result r
                INNER JOIN answer a ON r.answer_uuid = a.uuid
                WHERE r.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = NEW.uuid LIMIT 1)
                  AND LOWER(a.mentalstate::text) = LOWER(conclusion.mentalstate::text)
              )
            )
          )
        WHERE conclusion.user_uuid = (SELECT r.user_uuid FROM result r WHERE r.answer_uuid = NEW.uuid LIMIT 1)
          AND LOWER(conclusion.mentalstate::text) = LOWER((SELECT mentalstate::text FROM answer WHERE uuid = NEW.uuid));

        RETURN NULL;  -- For UPDATE, the trigger will not affect the row itself.
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_conclusion_value_after_answer_influence
      AFTER UPDATE OF influence ON answer
      FOR EACH ROW
      EXECUTE FUNCTION update_conclusion_value_after_answer_influence();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_conclusion_value_after_result ON result`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_conclusion_value_after_answer_influence ON answer`
    );

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_conclusion_value_after_result`
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_conclusion_value_after_answer_influence`
    );
  }
}
