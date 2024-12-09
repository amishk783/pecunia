import dotenv from 'dotenv';
const envFound = dotenv.config();

if (process.env.NODE_ENV === 'development' && envFound.error) {
  throw new Error("Couldn't find .env file");
}

interface ServerConfig {
  nodeEnv: string;
  port: number;
  databaseURL: string;
  jwtSecret: string;
  geminiAIApiKey: string;
  apiBasePath: string;
  openAIApikey: string;
  logs: { level: string };
  upstashRedisKey: string;
  upstashRedisUrl: string;
}

const config: ServerConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000') || 3000,
  openAIApikey: process.env.OPENAI_API_KEY || '',
  geminiAIApiKey: process.env.GEMINI_API_KEY || '',
  databaseURL: process.env.DATABASE_URI || '',
  apiBasePath: process.env.API_BASE_PATH || '/api',
  jwtSecret: process.env.JWT_SECRET || '',
  upstashRedisKey: process.env.UPSTASH_REDIS_KEY || '',
  upstashRedisUrl: process.env.UPSTASH_REDIS_URL || '',

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};
export default config;
