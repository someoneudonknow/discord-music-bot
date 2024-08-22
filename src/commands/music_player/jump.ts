import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to the track of given position")
    .addNumberOption((option) =>
      option
        .setName("position")
        .setDescription("Position to jump to")
        .setRequired(true)
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);

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

    const pos = interaction.options.get("position", true);

    if (!pos)
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Please enter a position to jump to",
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

    const jumpedTrack = queue.tracks.toArray()[position];
    const isJumpSuccess = queue.node.jump(jumpedTrack);

    if (isJumpSuccess) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: `Jump to ~ [${jumpedTrack}]`,
            },
            { withPrefix: true }
          ),
        ],
      }));
    } else {
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
    }
  },
} as SlashCommandModule;
