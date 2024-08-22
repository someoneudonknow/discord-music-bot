"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getAllLocalCommands_1 = __importDefault(require("../utils/getAllLocalCommands"));
const app_config_1 = __importDefault(require("../config/app.config"));
exports.default = async () => {
    const { discord: { token, app_id }, } = app_config_1.default;
    const localCommands = (0, getAllLocalCommands_1.default)();
    const jsonLocalCommands = localCommands.map((lc) => lc.command.toJSON());
    const rest = new discord_js_1.REST().setToken(token);
    try {
        console.log(`Started refreshing ${jsonLocalCommands.length} application (/) commands.`);
        const data = await rest.put(discord_js_1.Routes.applicationCommands(app_id), {
            body: jsonLocalCommands,
        });
        console.log(`Successfully reloaded ${data?.length} application (/) commands.`);
    }
    catch (e) {
        console.error(e);
    }
};
