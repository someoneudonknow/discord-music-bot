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
        .setName("pause")
        .setDescription("Pause current playing song"),
    callback: async (_, interaction) => {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        await interaction.deferReply();
        if (!queue || queue.isEmpty()) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No track found",
                        description: "Track queue is empty!",
                    }, { withPrefix: true }),
                ],
            });
        }
        if (!queue.isPlaying()) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No song are being played at a time",
                    }, { withPrefix: true }),
                ],
            });
        }
        const track = queue.currentTrack;
        if (!track)
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: `Something went wrong`,
                        description: "Track not found",
                    }, { withPrefix: true }),
                ],
            }));
        const isPauseSuccess = queue.node.pause();
        const queuePosition = queue.node.getTrackPosition(track);
        if (isPauseSuccess) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: `${track.title} has been pause`,
                        thumbnail: {
                            url: track.thumbnail,
                        },
                        fields: [
                            { name: "Duration", value: track.duration, inline: true },
                            {
                                name: "Position",
                                value: String(queuePosition),
                                inline: true,
                            },
                        ],
                        ...(track?.requestedBy && {
                            author: {
                                name: track.requestedBy.username,
                                iconURL: track.requestedBy.displayAvatarURL(),
                            },
                        }),
                    }, { withPrefix: "⏸ [Paused] -" }),
                ],
            }));
        }
        else {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: `Error occur while trying to pause ${track.title}`,
                    }, { withPrefix: true }),
                ],
            }));
        }
    },
};
