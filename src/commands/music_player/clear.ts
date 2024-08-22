import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Remove all the tracks from the queue ( This command won't stop the current track playing )"
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);

    if (!queue || queue.isEmpty()) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No track found",
              description: "Track's queue is empty!",
            },
            { withPrefix: true }
          ),
        ],
      }));
    }
    try {
      queue.clear();

      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: "Queue has been clear!",
            },
            { withPrefix: true }
          ),
        ],
      }));
    } catch (e: any) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: `Error occur ${e.message}!`,
            },
            { withPrefix: true }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
