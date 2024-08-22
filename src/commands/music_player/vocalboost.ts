import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("vocalboost")
    .setDescription("Toggle vocal boost filter")
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

    if (!queue.filters.equalizer)
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Equalizer is not enabled for this track!",
            },
            { withPrefix: true }
          ),
        ],
      });

    const { value } = interaction.options.get("state", true);

    if (value) {
      queue.filters.equalizer.setEQ([
        { band: 0, gain: -0.2 },
        { band: 1, gain: -0.2 },
        { band: 2, gain: 0.2 },
        { band: 3, gain: 0.15 },
        { band: 4, gain: 0.1 },
        { band: 5, gain: -0.1 },
      ]);
    } else {
      queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.Flat);
    }

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: `I have successfully ${
              value ? "enabled" : "disabled"
            } the vocal boost filter.`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
