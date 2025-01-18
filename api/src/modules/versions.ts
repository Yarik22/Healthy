import * as dotenv from "dotenv";

dotenv.config();

export const ApiVersion = {
  CurrentVersion: process.env.API_VERSION,
  // Version01: "0.1",
};
