import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause current playing song"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    const queue = useQueue(interaction.guildId as string);

    await interaction.deferReply();

    if (!queue || queue.isEmpty()) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No track found",
              description: "Track queue is empty!",
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    if (!queue.isPlaying()) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No song are being played at a time",
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    const track = queue.currentTrack;

    if (!track)
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: `Something went wrong`,
              description: "Track not found",
            },
            { withPrefix: true }
          ),
        ],
      }));

    const isPauseSuccess = queue.node.pause();
    const queuePosition = queue.node.getTrackPosition(track);

    if (isPauseSuccess) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: `${track.title} has been pause`,
              thumbnail: {
                url: track.thumbnail,
              },
              fields: [
                { name: "Duration", value: track.duration, inline: true },
                {
                  name: "Position",
                  value: String(queuePosition),
                  inline: true,
                },
              ],
              ...(track?.requestedBy && {
                author: {
                  name: track.requestedBy.username,
                  iconURL: track.requestedBy.displayAvatarURL(),
                },
              }),
            },
            { withPrefix: "⏸ [Paused] -" }
          ),
        ],
      }));
    } else {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: `Error occur while trying to pause ${track.title}`,
            },
            { withPrefix: true }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
