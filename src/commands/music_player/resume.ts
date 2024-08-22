import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume current playing song"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);

    if (!queue)
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No track has been found",
              description: "Use '/play' to add a track to queue",
            },
            { withPrefix: true }
          ),
        ],
      }));

    if (!queue.node.isPaused())
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Track are playing now",
            },
            { withPrefix: true }
          ),
        ],
      }));

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

    const isResumeSuccess = queue.node.resume();
    const queuePosition = queue.node.getTrackPosition(track);

    if (isResumeSuccess) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: `Resume ${track.title}`,
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
            { withPrefix: "▶ [Resume] -" }
          ),
        ],
      }));
    } else {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Something went wrong",
            },
            { withPrefix: true }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
