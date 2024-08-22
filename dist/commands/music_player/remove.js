"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
const formatOrdinal_1 = __importDefault(require("../../utils/formatOrdinal"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove the track from given position")
        .addNumberOption((option) => option
        .setName("position")
        .setDescription("A position of a track you want to remove")
        .setRequired(true)),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue || queue.isEmpty())
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "No tracks found!",
                    }, { withPrefix: true }),
                ],
            });
        const pos = interaction.options.get("position", true);
        if (!pos)
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Please enter a position to remove",
                    }, { withPrefix: true }),
                ],
            });
        const { value } = pos;
        const position = parseInt(value);
        if (position > queue.size - 1 || position < 0) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "The provided position is not valid.",
                    }, { withPrefix: true }),
                ],
            });
        }
        const removedTrack = queue.node.remove(position);
        if (!removedTrack) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Something went wrong!",
                    }, { withPrefix: true }),
                ],
            }));
        }
        else {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: `Successfully removed the ${(0, formatOrdinal_1.default)(position)} track.`,
                        description: `[${removedTrack.title}](${removedTrack.url})`,
                        thumbnail: { url: removedTrack.thumbnail },
                    }, { withPrefix: "🗑 [Removed] -" }),
                ],
            }));
        }
    },
};
