"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
const paginateTracks_1 = __importDefault(require("../../utils/paginateTracks"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("list")
        .setDescription("List all tracks information")
        .addStringOption((option) => option
        .setName("from")
        .setDescription("List tracks from history or queue")
        .addChoices([
        { name: "queue", value: "queue" },
        { name: "history", value: "history" },
    ])
        .setRequired(true)),
    callback: async (_, interaction) => {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        const history = (0, discord_player_1.useHistory)(interaction.guildId);
        const from = interaction.options.get("from");
        if (!from)
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "Choose a place to load tracks!",
                    }, { withPrefix: true }),
                ],
            });
        await interaction.deferReply();
        const { value } = from;
        if (value === "queue" && (!queue || queue?.isEmpty())) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No tracks found!",
                    }, { withPrefix: true }),
                ],
            });
        }
        if (value === "history" && (!history || history?.isEmpty())) {
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No tracks found!",
                    }, { withPrefix: true }),
                ],
            });
        }
        const limit = 10;
        let tracks = value === "queue" ? queue?.tracks.toArray() : history?.tracks.toArray();
        if (!tracks)
            tracks = [];
        return await (0, paginateTracks_1.default)(tracks, limit, interaction.user.id, async (embeds, currentPage, row) => await interaction.editReply({
            embeds: [embeds[currentPage]],
            components: [row],
        }));
    },
};
