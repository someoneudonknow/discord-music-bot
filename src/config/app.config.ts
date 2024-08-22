import { AppConfig } from "../types";

const config: AppConfig = {
  dev: {
    discord: {
      token: process.env.DISCORD_TOKEN_DEV || "",
      client_id: process.env.DISCORD_CLIENT_ID_DEV || "",
      app_id: process.env.DISCORD_APP_ID_DEV || "",
    },
  },
  prod: {
    discord: {
      token: process.env.DISCORD_TOKEN_PROD || "",
      client_id: process.env.DISCORD_CLIENT_ID_PROD || "",
      app_id: process.env.DISCORD_APP_ID_PROD || "",
    },
  },
};

const env = process.env.NODE_ENV || "dev";

export default config[env as keyof AppConfig];
