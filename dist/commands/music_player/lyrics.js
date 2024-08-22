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
        .setName("lyrics")
        .setDescription("Get lyrics for a song.")
        .addStringOption((option) => option
        .setName("query")
        .setDescription("The title of a song to get lyrics for.")),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        const input = interaction.options.get("query");
        let query = input?.value;
        if (!query && !queue?.currentTrack) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Provide a song title to get lyrics.",
                    }, { withPrefix: true }),
                ],
            }));
        }
        if (!query)
            query = `${queue?.currentTrack?.author} - ${queue?.currentTrack?.cleanTitle}`;
        const player = (0, discord_player_1.useMainPlayer)();
        const lyrics = await player.lyrics.search({
            q: query,
        });
        if (!lyrics.length)
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No lyrics found!",
                    }, { withPrefix: true }),
                ],
            }));
        const trimmedLyrics = lyrics[0]?.syncedLyrics?.substring(0, 4096) ||
            lyrics[0].plainLyrics.substring(0, 4096);
        const embed = EmbedGenerator_1.default.Success({
            title: lyrics[0].name,
            author: {
                name: lyrics[0].artistName,
            },
            description: trimmedLyrics.length === 4096 ? `${trimmedLyrics}...` : trimmedLyrics,
        });
        return void (await interaction.editReply({ embeds: [embed] }));
    },
};
