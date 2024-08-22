"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
const timeToMS_1 = __importDefault(require("../../utils/timeToMS"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("seek")
        .setDescription("Seek the player to a specific timestamp.")
        .addStringOption((option) => option
        .setName("timestamp")
        .setDescription("The timestamp to seek to (mm:ss).")
        .setRequired(true)),
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
        const timeString = interaction.options.get("timestamp", true);
        const { value: time } = timeString;
        const timestamp = (0, timeToMS_1.default)(time);
        if (timestamp > queue.currentTrack.durationMS) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: `Provide a valid timestamp within 00:00 and ${queue.currentTrack.duration}.`,
                    }, { withPrefix: true }),
                ],
            });
        }
        await queue.node.seek(timestamp);
        return void (await interaction.editReply({
            embeds: [
                EmbedGenerator_1.default.Success({
                    title: `Seeked to ${discord_player_1.Util.formatDuration(timestamp)}.`,
                    description: `Track ~ [${queue.currentTrack}]`,
                }, { withPrefix: true }),
            ],
        }));
    },
};
