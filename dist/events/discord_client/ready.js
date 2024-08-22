"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getAllLocalCommands_1 = __importDefault(require("../../utils/getAllLocalCommands"));
const logger_1 = __importDefault(require("../../helpers/logger"));
exports.default = {
    type: discord_js_1.Events.ClientReady,
    once: true,
    execute: async (client) => {
        (0, logger_1.default)("info", `Logged in as ${client.user?.tag}`);
        const commandObjects = (0, getAllLocalCommands_1.default)();
        for (const commandObject of commandObjects) {
            const { command } = commandObject;
            if (command)
                client.commands.set(command.name, commandObject);
        }
    },
};
