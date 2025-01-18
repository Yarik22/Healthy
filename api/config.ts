export const config = () => ({
  api: {
    prefix: process.env.API_PREFIX || "api",
    version: process.env.API_VERSION || "1",
  },
  swagger: {
    prefix: process.env.SWAGGER_PREFIX || "docs",
  },
  port: process.env.APP_PORT || 3000,
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: +process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  google: {
    callbackUrl: process.env.CALLBACK_URL,
    clientSecret: process.env.CLIENT_SECRET,
    clientId: process.env.CLIENT_ID,
  },
});
