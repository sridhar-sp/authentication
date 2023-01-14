import dotenv from "dotenv";

dotenv.config();

interface Config {
  appName: string;
  port: string;
}

const config: Config = {
  appName: process.env.APP_NAME!!,
  port: process.env.PORT!!,
};

export default config;
