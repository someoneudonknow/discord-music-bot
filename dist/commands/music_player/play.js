"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
const LEAVE_ON_EMPTY_COOLDOWN_IN_MINUTES = 5 * 60 * 1000;
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Play and enqueue a track from given URL or the search result of a keyword")
        .addStringOption((option) => option
        .setName("query")
        .setDescription("Enter URL or keyword")
        .setRequired(true)),
    callback: async (_, interaction) => {
        const player = (0, discord_player_1.useMainPlayer)();
        if (!(interaction.member instanceof discord_js_1.GuildMember) ||
            !interaction.member.voice.channel) {
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "You are not in a voice channel!",
                    }, { withPrefix: true }),
                ],
            });
        }
        await interaction.deferReply();
        const query = interaction.options.get("query");
        if (query) {
            const { value } = query;
            const queryResult = await player.search(value, {
                requestedBy: interaction.user,
                searchEngine: discord_player_1.QueryType.AUTO,
            });
            if (!queryResult || !queryResult.hasTracks())
                return await interaction.editReply({
                    embeds: [
                        EmbedGenerator_1.default.Info({
                            title: `No results were found for ${value}`,
                        }, { withPrefix: true }),
                    ],
                });
            try {
                const { track, searchResult } = await player.play(interaction.member.voice.channel, queryResult, {
                    nodeOptions: {
                        metadata: interaction,
                    },
                });
                const queue = (0, discord_player_1.useQueue)(interaction.guildId);
                let fields = [
                    {
                        name: "Queue size",
                        value: String(queue?.size) || "Unknown",
                        inline: true,
                    },
                ];
                if (searchResult.playlist) {
                    fields = [
                        ...fields,
                        {
                            name: "Playlist",
                            value: searchResult.playlist.title,
                            inline: true,
                        },
                    ];
                }
                return await interaction.editReply({
                    embeds: [
                        EmbedGenerator_1.default.Success({
                            title: `${searchResult.hasPlaylist() ? "Playlist" : "Track"} queued!`,
                            thumbnail: { url: track.thumbnail },
                            description: `[${track.title}](${track.url})`,
                            fields,
                            author: {
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL(),
                            },
                        }, { withPrefix: true }),
                    ],
                });
            }
            catch (e) {
                return await interaction.editReply({
                    embeds: [
                        EmbedGenerator_1.default.Error({
                            title: "Something went wrong",
                            description: `Something went wrong while trying to play \`${query}\``,
                            author: {
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL(),
                            },
                        }, { withPrefix: true }),
                    ],
                });
            }
        }
    },
};
