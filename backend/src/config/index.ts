import dotenv from "dotenv";
const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

interface ServerConfig {
  nodeEnv: string;
  port: number;
  databaseURL: string;
  jwtSecret: string;
  apiBasePath: string;
  logs: { level: string };
}

const config: ServerConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000") || 3000,
  databaseURL: process.env.DATABASE_URI || "",
  apiBasePath: process.env.API_BASE_PATH || "/api",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
};
export default config;
