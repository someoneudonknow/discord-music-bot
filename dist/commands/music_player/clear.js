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
        .setName("clear")
        .setDescription("Remove all the tracks from the queue ( This command won't stop the current track playing )"),
    callback: async (_, interaction) => {
        await interaction.deferReply();
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (!queue || queue.isEmpty()) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "No track found",
                        description: "Track's queue is empty!",
                    }, { withPrefix: true }),
                ],
            }));
        }
        try {
            queue.clear();
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: "Queue has been clear!",
                    }, { withPrefix: true }),
                ],
            }));
        }
        catch (e) {
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: `Error occur ${e.message}!`,
                    }, { withPrefix: true }),
                ],
            }));
        }
    },
};
