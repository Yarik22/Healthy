import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const isCompiled = __dirname.includes("dist");
const rootPath = isCompiled ? "dist/src" : "src";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: "file",
  entities: [`${rootPath}/**/*.entity.{ts,js}`],
  migrations: [`${rootPath}/migrations/**/*.{ts,js}`],
  subscribers: [`${rootPath}/subscriber/**/*.{ts,js}`],
  migrationsTableName: "migrations",
});
module.exports = { AppDataSource };
