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
        .setName("resume")
        .setDescription("Pause current playing song"),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue)
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No track has been found",
                        description: "Use '/play' to add a track to queue",
                    }, { withPrefix: true }),
                ],
            }));
        if (!queue.node.isPaused())
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Track are playing now",
                    }, { withPrefix: true }),
                ],
            }));
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
        const isResumeSuccess = queue.node.resume();
        const queuePosition = queue.node.getTrackPosition(track);
        if (isResumeSuccess) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: `Resume ${track.title}`,
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
                    }, { withPrefix: "▶ [Resume] -" }),
                ],
            }));
        }
        else {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Something went wrong",
                    }, { withPrefix: true }),
                ],
            }));
        }
    },
};
