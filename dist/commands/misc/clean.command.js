"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("clean")
        .setDescription("Clean all the bot messages"),
    callback: async (client, interaction) => {
        const channel = interaction.channel;
        try {
            const messages = await channel.messages.fetch();
            const botMessages = messages.filter((msg) => msg.author.id === client?.user?.id && msg.author.bot);
            await interaction.deferReply();
            await Promise.allSettled(Array.from(botMessages.values()).map(async (m) => {
                return await m.delete();
            }));
            return void (await interaction.editReply({
                embeds: [
                    EmbedGenerator_1.default.Success({
                        title: "Messages has successfully been cleaned!",
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
