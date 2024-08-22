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
        .setName("back")
        .setDescription("Play previous track"),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const history = (0, discord_player_1.useHistory)(interaction.guildId);
        if (!history || history.isEmpty())
            return await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "There is no previous track to go back",
                    }, { withPrefix: true }),
                ],
            });
        await history.previous();
        const prevTrack = history.currentTrack;
        return void (await interaction.editReply({
            embeds: [
                EmbedGenerator_1.default.Success({
                    title: "Went back to the previous song.",
                    description: `Track ~ ${prevTrack}`,
                }, { withPrefix: true }),
            ],
        }));
    },
};
