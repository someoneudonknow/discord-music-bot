"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getAllLocalCommands_1 = __importDefault(require("../../utils/getAllLocalCommands"));
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("See all commands info"),
    callback: async (_, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const commands = (0, getAllLocalCommands_1.default)(["help"]);
            await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "💡Help",
                        fields: commands.map((c) => ({
                            name: `${c.command.name
                                .charAt(0)
                                .toUpperCase()}${c.command.name.substring(1)}`,
                            value: `- ${c.command.description}`,
                        })),
                    }),
                ],
            });
        }
        catch (e) {
            await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Error({
                        title: "Something went wrong",
                    }),
                ],
            });
        }
    },
};
