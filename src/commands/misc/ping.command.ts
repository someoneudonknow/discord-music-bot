import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";

export default {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Use this command for testing the bot response"),
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      await interaction.reply({
        content: `Pong ${client.ws.ping}`,
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
    }
  },
} as SlashCommandModule;
