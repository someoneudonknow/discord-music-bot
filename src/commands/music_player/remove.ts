import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import formatOrdinal from "../../utils/formatOrdinal";

export default {
  command: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove the track from given position")
    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("A position of a track you want to remove")
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
              title: "No tracks found!",
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
              title: "Please enter a position to remove",
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
    const removedTrack = queue.node.remove(position);

    if (!removedTrack) {
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
              title: `Successfully removed the ${formatOrdinal(
                position
              )} track.`,
              description: `[${removedTrack.title}](${removedTrack.url})`,
              thumbnail: { url: removedTrack.thumbnail },
            },
            { withPrefix: "🗑 [Removed] -" }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
