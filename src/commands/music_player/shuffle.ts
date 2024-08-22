import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue, Util } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import timeToMS from "../../utils/timeToMS";

export default {
  command: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Toggle shuffle mode for this queue."),
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

    const mode = queue.toggleShuffle();

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: `${mode ? "Enabled" : "Disabled"} shuffle mode.`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
