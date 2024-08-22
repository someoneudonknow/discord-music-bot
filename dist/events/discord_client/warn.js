"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../../helpers/logger"));
exports.default = {
    type: discord_js_1.Events.Warn,
    once: true,
    execute: async (client, warnMessage) => {
        (0, logger_1.default)("warn", warnMessage);
    },
};
