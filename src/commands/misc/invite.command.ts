import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  OAuth2Scopes,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommandModule } from "../../types";

export default {
  command: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite the bot to your server"),
  callback: async (client: Client, interaction: CommandInteraction) => {
    const inviteLink = client.generateInvite({
      scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
      permissions: ["Administrator"],
    });

    const button = new ButtonBuilder()
      .setLabel("Click to add the bot to your server.")
      .setStyle(ButtonStyle.Link)
      .setURL(inviteLink);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    return void (await interaction.reply({
      ephemeral: true,
      content: `** Full link: ${inviteLink} **`,
      components: [row],
    }));
  },
} as SlashCommandModule;
