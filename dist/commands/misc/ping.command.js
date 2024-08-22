"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Use this command for testing the bot response"),
    callback: async (client, interaction) => {
        try {
            await interaction.reply({
                content: `Pong ${client.ws.ping}`,
                ephemeral: true,
            });
        }
        catch (e) {
            console.log(e);
        }
    },
};
