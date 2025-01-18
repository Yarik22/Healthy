import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";
import { RoleName } from "../../../shared/enums/user.enum";

config();

export class SchemaUpdate1736945562961 implements MigrationInterface {

private async getHashedToken(secret: string): Promise<string> {
    if (!secret) {
      throw new Error("Role secret is missing");
    }
    const saltRounds = 10;
    const hashedToken = await bcrypt.hash(secret, saltRounds);
    return hashedToken;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const secretAdmin = process.env.ROLE_SECRET_ADMIN;
    const secretUser = process.env.ROLE_SECRET_USER;
    const secretModerator = process.env.ROLE_SECRET_MODERATOR;

    const hashedTokenAdmin = await this.getHashedToken(secretAdmin);
    const hashedTokenUser = await this.getHashedToken(secretUser);
    const hashedTokenModerator = await this.getHashedToken(secretModerator);

    await queryRunner.query(`
          INSERT INTO role (name, description, token)
          VALUES
            ('${RoleName.Admin}', 'Admin role with all permissions', '${hashedTokenAdmin}'),
            ('${RoleName.User}', 'Standard user role', '${hashedTokenUser}'),
            ('${RoleName.Moderator}', 'Moderator with limited permissions', '${hashedTokenModerator}')
        `);

    await queryRunner.query(`
          CREATE OR REPLACE FUNCTION assign_user_role()
          RETURNS TRIGGER AS $$
          BEGIN
            -- Insert the user-role association by finding the 'User' role
            INSERT INTO user_role (user_uuid, role_uuid)
            SELECT NEW.uuid, role.uuid
            FROM role
            WHERE role.name = '${RoleName.User}'; -- Find 'User' role by name
            
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
          CREATE TRIGGER assign_user_role_after_insert
          AFTER INSERT ON "user"
          FOR EACH ROW
          EXECUTE FUNCTION assign_user_role();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TRIGGER IF EXISTS assign_user_role_after_insert ON "user";
        `);

    await queryRunner.query(`
          DROP FUNCTION IF EXISTS assign_user_role();
        `);

    await queryRunner.query(`
          DELETE FROM role
          WHERE name IN ('${RoleName.Admin}', '${RoleName.User}', '${RoleName.Moderator}');
        `);
  }
}