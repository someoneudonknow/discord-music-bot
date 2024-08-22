import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import getAllLocalCommands from "../../utils/getAllLocalCommands";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See all commands info"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const commands = getAllLocalCommands(["help"]);

      await interaction.editReply({
        embeds: [
          EmbedGenerator.Info({
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
    } catch (e) {
      await interaction.editReply({
        embeds: [
          EmbedGenerator.Error({
            title: "Something went wrong",
          }),
        ],
      });
    }
  },
} as SlashCommandModule;
