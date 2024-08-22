"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the player"),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        const isStopSuccess = queue?.node.stop();
        if (isStopSuccess)
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: "Successfully stop the player",
                    }, { withPrefix: true }),
                ],
            }));
        return void (await interaction.editReply({
            embeds: [
                EmbedGenerator_1.default.Error({
                    title: "Something went wrong!",
                }, { withPrefix: true }),
            ],
        }));
    },
};
