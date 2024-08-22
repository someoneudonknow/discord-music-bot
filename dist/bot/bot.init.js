"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const deployCommands_1 = __importDefault(require("../helpers/deployCommands"));
const app_config_1 = __importDefault(require("../config/app.config"));
const discord_player_1 = require("discord-player");
const getAllFiles_1 = __importDefault(require("../utils/getAllFiles"));
const path_1 = require("path");
const discord_player_youtubei_1 = require("discord-player-youtubei");
const logger_1 = __importDefault(require("../helpers/logger"));
const { discord: { token }, } = app_config_1.default;
class Bot {
    static _instance = null;
    static get instance() {
        if (Bot._instance === null) {
            Bot._instance = new Bot();
        }
        return Bot._instance;
    }
    client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.MessageContent,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildVoiceStates,
            discord_js_1.GatewayIntentBits.GuildMembers,
        ],
    });
    player = new discord_player_1.Player(this.client);
    constructor() {
        this.client.commands = new discord_js_1.Collection();
    }
    async setUp() {
        this.handleDiscordClientEvents();
        this.handlePlayerEvents();
        await (0, deployCommands_1.default)();
        await this.player.extractors.register(discord_player_youtubei_1.YoutubeiExtractor, {});
        await this.player.extractors.loadDefault();
    }
    async setUpAndLogin() {
        await this.setUp();
        await this.client.login(token);
    }
    handlePlayerEvents() {
        const eventFiles = (0, getAllFiles_1.default)((0, path_1.join)(__dirname, "..", "events", "discord_player"));
        for (const eventFile of eventFiles) {
            const requiredFile = require(eventFile);
            const eventObject = requiredFile.default;
            if (eventObject) {
                const { execute, type, once } = eventObject;
                if (once) {
                    this.player.events.once(type, execute);
                }
                else {
                    this.player.events.on(type, execute);
                }
            }
        }
    }
    handleDiscordClientEvents() {
        const eventFiles = (0, getAllFiles_1.default)((0, path_1.join)(__dirname, "..", "events", "discord_client"));
        for (const eventFile of eventFiles) {
            const requiredFile = require(eventFile);
            const eventObject = requiredFile.default;
            if (eventObject) {
                const { execute, type, once } = eventObject;
                if (once) {
                    this.client.once(type, async (...args) => {
                        try {
                            await execute(this.client, ...args);
                        }
                        catch (e) {
                            (0, logger_1.default)("error", e.message);
                        }
                    });
                }
                else {
                    this.client.on(type, async (...args) => {
                        try {
                            await execute(this.client, ...args);
                        }
                        catch (e) {
                            (0, logger_1.default)("error", e.message);
                        }
                    });
                }
            }
        }
    }
}
const bot = Bot.instance;
exports.default = bot;
