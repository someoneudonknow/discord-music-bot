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
        .setName("8d")
        .setDescription("Toggle vocal 8d filter")
        .addBooleanOption((option) => option
        .setName("state")
        .setDescription("Whether to enable or disable the filter")
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
        if (!queue.isPlaying())
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "No track is being played!",
                    }, { withPrefix: true }),
                ],
            });
        if (!queue.filters.filters)
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "8D filter is not enabled for this track!",
                    }, { withPrefix: true }),
                ],
            });
        const { value } = interaction.options.get("state", true);
        if (value) {
            queue.filters.filters.setFilters(["8D"]);
        }
        else {
            queue.filters.filters.setFilters([]);
        }
        return void (await interaction.editReply({
            embeds: [
                EmbedGenerator_1.default.Success({
                    title: `I have successfully ${value ? "enabled" : "disabled"} the 8d filter.`,
                }, { withPrefix: true }),
            ],
        }));
    },
};
