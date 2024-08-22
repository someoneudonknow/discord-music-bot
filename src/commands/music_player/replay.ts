import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue, Util } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import timeToMS from "../../utils/timeToMS";

export default {
  command: new SlashCommandBuilder()
    .setName("replay")
    .setDescription("Replay current track"),
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

    await queue.node.seek(0);

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: `Replaying the current song.`,
            description: `Track ~ [${queue.currentTrack}]`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
