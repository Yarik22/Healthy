import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1736872634742 implements MigrationInterface {
    name = 'SchemaUpdate1736872634742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conclusion_mentalstate_enum" AS ENUM('aggression', 'calmness', 'happiness', 'sadness', 'fearAnxiety', 'envy', 'guilt', 'pride', 'love', 'disgust', 'attention', 'memory', 'problemSolving', 'decisionMaking', 'creativity', 'perception', 'extraversion', 'introversion', 'openness', 'conscientiousness', 'agreeableness', 'neuroticism', 'stress', 'resilience', 'emotionalRegulation', 'overthinking', 'copingMechanisms', 'empathy', 'trust', 'loneliness', 'altruism', 'socialAnxiety', 'attachment', 'motivation', 'selfEsteem', 'goalOrientedness', 'perfectionism', 'moralDilemmas', 'integrity', 'justiceFairness', 'mindfulness', 'selfReflection', 'gratitude', 'acceptance', 'productivity', 'timeManagement', 'motivationAtWork', 'burnout', 'sleepQuality', 'fatigue', 'emotionalAwareness', 'emotionalExpression', 'conflictResolution', 'socialPerception', 'spiritualConnection', 'meaningOfLife', 'impulsivity', 'riskTaking', 'procrastination', 'compulsiveBehavior', 'bounceBackAbility', 'flexibilityAdaptability')`);
        await queryRunner.query(`CREATE TABLE "conclusion" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mentalState" "public"."conclusion_mentalstate_enum" NOT NULL, "value" integer NOT NULL, "user_uuid" uuid, CONSTRAINT "CHK_4aa54b971aa12aee0ad0074c59" CHECK (value >= 0 AND value <= 100), CONSTRAINT "PK_cb570f31a59d3222abd0fbd3082" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('admin', 'user', 'moderator')`);
        await queryRunner.query(`CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."role_name_enum" NOT NULL DEFAULT 'user', "description" character varying(1000), "token" character varying(255) NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "UQ_2cfa395daced6c810c8c4aaf1bb" UNIQUE ("token"), CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "test" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100) NOT NULL, "description" character varying(1000), "img" bytea, CONSTRAINT "UQ_2be572eb4330bf8387466d8e052" UNIQUE ("title"), CONSTRAINT "CHK_715ab176e0b6d7b723bb373b5c" CHECK (length(img) <= 5242880), CONSTRAINT "PK_b2022f60bfeca87c976a73df8c6" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."answer_mentalstate_enum" AS ENUM('aggression', 'calmness', 'happiness', 'sadness', 'fearAnxiety', 'envy', 'guilt', 'pride', 'love', 'disgust', 'attention', 'memory', 'problemSolving', 'decisionMaking', 'creativity', 'perception', 'extraversion', 'introversion', 'openness', 'conscientiousness', 'agreeableness', 'neuroticism', 'stress', 'resilience', 'emotionalRegulation', 'overthinking', 'copingMechanisms', 'empathy', 'trust', 'loneliness', 'altruism', 'socialAnxiety', 'attachment', 'motivation', 'selfEsteem', 'goalOrientedness', 'perfectionism', 'moralDilemmas', 'integrity', 'justiceFairness', 'mindfulness', 'selfReflection', 'gratitude', 'acceptance', 'productivity', 'timeManagement', 'motivationAtWork', 'burnout', 'sleepQuality', 'fatigue', 'emotionalAwareness', 'emotionalExpression', 'conflictResolution', 'socialPerception', 'spiritualConnection', 'meaningOfLife', 'impulsivity', 'riskTaking', 'procrastination', 'compulsiveBehavior', 'bounceBackAbility', 'flexibilityAdaptability')`);
        await queryRunner.query(`CREATE TABLE "answer" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mentalState" "public"."answer_mentalstate_enum" NOT NULL, "influence" integer NOT NULL, "text" character varying(250), "img" bytea, "question_uuid" uuid, CONSTRAINT "CHK_f9210e2c80d52edbc05ad7c1de" CHECK (length(img) <= 5242880), CONSTRAINT "CHK_f531bda678d5a5e991a162fe24" CHECK ("influence" >= 0 AND "influence" <= 10), CONSTRAINT "PK_750fc24c0d920995b3ea04549d5" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "question" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(200) NOT NULL, "description" character varying(1000), "img" bytea, CONSTRAINT "UQ_83ba3cab2514695c0cdf6b835f5" UNIQUE ("title"), CONSTRAINT "CHK_1db7c6fc789edcb92ab1ea045f" CHECK (length(img) <= 5242880), CONSTRAINT "PK_6930ce56f7294538e3751b9f32a" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "result" ("user_uuid" uuid NOT NULL, "question_uuid" uuid NOT NULL, "answer_uuid" uuid, CONSTRAINT "PK_28402f995776dba801dec2c3ec8" PRIMARY KEY ("user_uuid", "question_uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_sex_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hashedPassword" character varying(320) NOT NULL, "email" character varying(320) NOT NULL, "nickname" character varying(50) NOT NULL, "birthdate" date, "sex" "public"."user_sex_enum", "bio" character varying(1000), "banned" boolean NOT NULL DEFAULT false, "img" bytea, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "UQ_d6e8ecf5a7a4793568b2f6e0c9a" UNIQUE ("email", "nickname"), CONSTRAINT "CHK_d21100fb1cb0f9cb5676cc2868" CHECK (length(img) <= 5242880), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_e2364281027b926b879fa2fa1e" ON "user" ("nickname") `);
        await queryRunner.query(`CREATE TYPE "public"."therapy_mentalstates_enum" AS ENUM('aggression', 'calmness', 'happiness', 'sadness', 'fearAnxiety', 'envy', 'guilt', 'pride', 'love', 'disgust', 'attention', 'memory', 'problemSolving', 'decisionMaking', 'creativity', 'perception', 'extraversion', 'introversion', 'openness', 'conscientiousness', 'agreeableness', 'neuroticism', 'stress', 'resilience', 'emotionalRegulation', 'overthinking', 'copingMechanisms', 'empathy', 'trust', 'loneliness', 'altruism', 'socialAnxiety', 'attachment', 'motivation', 'selfEsteem', 'goalOrientedness', 'perfectionism', 'moralDilemmas', 'integrity', 'justiceFairness', 'mindfulness', 'selfReflection', 'gratitude', 'acceptance', 'productivity', 'timeManagement', 'motivationAtWork', 'burnout', 'sleepQuality', 'fatigue', 'emotionalAwareness', 'emotionalExpression', 'conflictResolution', 'socialPerception', 'spiritualConnection', 'meaningOfLife', 'impulsivity', 'riskTaking', 'procrastination', 'compulsiveBehavior', 'bounceBackAbility', 'flexibilityAdaptability')`);
        await queryRunner.query(`CREATE TABLE "therapy" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100) NOT NULL, "description" character varying(1000), "url" character varying(500), "img" bytea, "mentalStates" "public"."therapy_mentalstates_enum" array NOT NULL, CONSTRAINT "UQ_f17dfa1b353a85db470d050a9a3" UNIQUE ("title"), CONSTRAINT "CHK_60763d1517062bdf20c42dea08" CHECK (length(img) <= 5242880), CONSTRAINT "PK_67573f585485462fc2202442c57" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_role" ("role_uuid" uuid NOT NULL, "user_uuid" uuid NOT NULL, CONSTRAINT "PK_b3ae719908a740d300f2032780b" PRIMARY KEY ("role_uuid", "user_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3838c6c75fb63afc447bc8fa64" ON "user_role" ("role_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_2dcc8bd6b8738bc96d9dcf229b" ON "user_role" ("user_uuid") `);
        await queryRunner.query(`CREATE TABLE "user_test" ("test_uuid" uuid NOT NULL, "user_uuid" uuid NOT NULL, CONSTRAINT "PK_9dc0853abaae813c2944b8fa5fe" PRIMARY KEY ("test_uuid", "user_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b1c7013267dcbb102fdedaa030" ON "user_test" ("test_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bc5d3410583225021819d5112" ON "user_test" ("user_uuid") `);
        await queryRunner.query(`CREATE TABLE "test_question" ("test_uuid" uuid NOT NULL, "question_uuid" uuid NOT NULL, CONSTRAINT "PK_3e1d90fcf71d8467b34e5d61c01" PRIMARY KEY ("test_uuid", "question_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8260db2c01881c5cb24dea5924" ON "test_question" ("test_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_d803e0caace4198e92e72a25ed" ON "test_question" ("question_uuid") `);
        await queryRunner.query(`ALTER TABLE "conclusion" ADD CONSTRAINT "FK_1ce7b9dfaa59d818f4f37ecab1a" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_e58b283e209892f9102f40fba11" FOREIGN KEY ("question_uuid") REFERENCES "question"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_0beca25532e6f7e3e16b31cf87a" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_9a5a2109a086ae18dce5e0162f7" FOREIGN KEY ("question_uuid") REFERENCES "question"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_0e29a9160518b73042cb324fdfd" FOREIGN KEY ("answer_uuid") REFERENCES "answer"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_3838c6c75fb63afc447bc8fa64f" FOREIGN KEY ("role_uuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_2dcc8bd6b8738bc96d9dcf229bd" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_test" ADD CONSTRAINT "FK_b1c7013267dcbb102fdedaa0308" FOREIGN KEY ("test_uuid") REFERENCES "test"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_test" ADD CONSTRAINT "FK_4bc5d3410583225021819d51126" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "test_question" ADD CONSTRAINT "FK_8260db2c01881c5cb24dea59241" FOREIGN KEY ("test_uuid") REFERENCES "test"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "test_question" ADD CONSTRAINT "FK_d803e0caace4198e92e72a25ede" FOREIGN KEY ("question_uuid") REFERENCES "question"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_question" DROP CONSTRAINT "FK_d803e0caace4198e92e72a25ede"`);
        await queryRunner.query(`ALTER TABLE "test_question" DROP CONSTRAINT "FK_8260db2c01881c5cb24dea59241"`);
        await queryRunner.query(`ALTER TABLE "user_test" DROP CONSTRAINT "FK_4bc5d3410583225021819d51126"`);
        await queryRunner.query(`ALTER TABLE "user_test" DROP CONSTRAINT "FK_b1c7013267dcbb102fdedaa0308"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_2dcc8bd6b8738bc96d9dcf229bd"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_3838c6c75fb63afc447bc8fa64f"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_0e29a9160518b73042cb324fdfd"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_9a5a2109a086ae18dce5e0162f7"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_0beca25532e6f7e3e16b31cf87a"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_e58b283e209892f9102f40fba11"`);
        await queryRunner.query(`ALTER TABLE "conclusion" DROP CONSTRAINT "FK_1ce7b9dfaa59d818f4f37ecab1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d803e0caace4198e92e72a25ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8260db2c01881c5cb24dea5924"`);
        await queryRunner.query(`DROP TABLE "test_question"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4bc5d3410583225021819d5112"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1c7013267dcbb102fdedaa030"`);
        await queryRunner.query(`DROP TABLE "user_test"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dcc8bd6b8738bc96d9dcf229b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3838c6c75fb63afc447bc8fa64"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "therapy"`);
        await queryRunner.query(`DROP TYPE "public"."therapy_mentalstates_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2364281027b926b879fa2fa1e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_sex_enum"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TYPE "public"."answer_mentalstate_enum"`);
        await queryRunner.query(`DROP TABLE "test"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`DROP TABLE "conclusion"`);
        await queryRunner.query(`DROP TYPE "public"."conclusion_mentalstate_enum"`);
    }

}
