"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const getAllFiles_1 = __importDefault(require("./getAllFiles"));
const logger_1 = __importDefault(require("../helpers/logger"));
exports.default = (exceptions) => {
    const localCommands = [];
    const commandCategories = (0, getAllFiles_1.default)((0, path_1.join)(__dirname, "..", "commands"), true);
    for (const commandCategory of commandCategories) {
        const commandFiles = (0, getAllFiles_1.default)(commandCategory);
        for (const commandFile of commandFiles) {
            const requiredCommandFile = require(commandFile);
            const commandObject = requiredCommandFile.default;
            if (!commandObject ||
                !("command" in commandObject) ||
                !("callback" in commandObject)) {
                (0, logger_1.default)("warn", `The command at ${commandFile} is missing a required "command" or "callback" property.`);
                continue;
            }
            if (exceptions?.includes(commandObject.command.name))
                continue;
            localCommands.push(commandObject);
        }
    }
    return localCommands;
};
