import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue, Util } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import timeToMS from "../../utils/timeToMS";

export default {
  command: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek the player to a specific timestamp.")
    .addStringOption((option) =>
      option
        .setName("timestamp")
        .setDescription("The timestamp to seek to (mm:ss).")
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

    if (!queue.isPlaying() || !queue.currentTrack)
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

    const timeString = interaction.options.get("timestamp", true);
    const { value: time } = timeString;
    const timestamp = timeToMS(time as string);

    if (timestamp > queue.currentTrack.durationMS) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: `Provide a valid timestamp within 00:00 and ${queue.currentTrack.duration}.`,
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    await queue.node.seek(timestamp);

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: `Seeked to ${Util.formatDuration(timestamp)}.`,
            description: `Track ~ [${queue.currentTrack}]`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
