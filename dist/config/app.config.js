"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
exports.default = config[env];
