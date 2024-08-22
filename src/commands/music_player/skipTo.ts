import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import formatOrdinal from "../../utils/formatOrdinal";

export default {
  command: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skip to specific position in queue")
    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("Position you want to skip to")
        .setRequired(true)
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);

    if (!queue || queue.isEmpty())
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "No track is being played!",
            },
            { withPrefix: true }
          ),
        ],
      });

    const pos = interaction.options.get("position", true);

    if (!pos)
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Please enter a position to skip to",
            },
            { withPrefix: true }
          ),
        ],
      });

    const { value } = pos;
    const position = parseInt(value as string);

    if (position > queue.size - 1 || position < 0) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "The provided position is not valid.",
            },
            { withPrefix: true }
          ),
        ],
      });
    }
    const skipSuccess = queue.node.skipTo(position - 1);

    if (!skipSuccess) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Something went wrong!",
            },
            { withPrefix: true }
          ),
        ],
      }));
    } else {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: `Skipped to the  ${formatOrdinal(position)} song.`,
            },
            { withPrefix: "⏩ [Skipped] -" }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
