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
        .setName("replay")
        .setDescription("Replay current track"),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue || queue.isEmpty())
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "No tracks has been found",
                    }, { withPrefix: true }),
                ],
            });
        if (!queue.isPlaying() || !queue.currentTrack)
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "No track is being played!",
                    }, { withPrefix: true }),
                ],
            });
        await queue.node.seek(0);
        return void (await interaction.editReply({
            embeds: [
                EmbedGenerator_1.default.Success({
                    title: `Replaying the current song.`,
                    description: `Track ~ [${queue.currentTrack}]`,
                }, { withPrefix: true }),
            ],
        }));
    },
};
