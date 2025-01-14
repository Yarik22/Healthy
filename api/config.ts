export const config = () => ({
  api: {
    prefix: process.env.API_PREFIX || "api",
    version: process.env.API_VERSION || "v1",
  },
  port: process.env.APP_PORT || 3000,
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: +process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
});
