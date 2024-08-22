import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("8d")
    .setDescription("Toggle vocal 8d filter")
    .addBooleanOption((option) =>
      option
        .setName("state")
        .setDescription("Whether to enable or disable the filter")
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
              title: "No tracks has been found",
            },
            { withPrefix: true }
          ),
        ],
      });

    if (!queue.isPlaying())
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

    if (!queue.filters.filters)
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "8D filter is not enabled for this track!",
            },
            { withPrefix: true }
          ),
        ],
      });

    const { value } = interaction.options.get("state", true);

    if (value) {
      queue.filters.filters.setFilters(["8D"]);
    } else {
      queue.filters.filters.setFilters([]);
    }

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: `I have successfully ${
              value ? "enabled" : "disabled"
            } the 8d filter.`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
