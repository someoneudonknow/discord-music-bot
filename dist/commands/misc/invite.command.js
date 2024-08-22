"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite the bot to your server"),
    callback: async (client, interaction) => {
        const inviteLink = client.generateInvite({
            scopes: [discord_js_1.OAuth2Scopes.ApplicationsCommands, discord_js_1.OAuth2Scopes.Bot],
            permissions: ["Administrator"],
        });
        const button = new discord_js_1.ButtonBuilder()
            .setLabel("Click to add the bot to your server.")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setURL(inviteLink);
        const row = new discord_js_1.ActionRowBuilder().addComponents(button);
        return void (await interaction.reply({
            ephemeral: true,
            content: `** Full link: ${inviteLink} **`,
            components: [row],
        }));
    },
};
