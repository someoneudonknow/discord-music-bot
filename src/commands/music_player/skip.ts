import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current playing song"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);
    const currentTrack = queue?.currentTrack;

    if (!queue || queue.isEmpty())
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "No track in queue",
            },
            { withPrefix: true }
          ),
        ],
      });

    const skipSuccess = queue?.node.skip();

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
              title: `${currentTrack}`,
            },
            { withPrefix: "⏩ [Skipped] -" }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
