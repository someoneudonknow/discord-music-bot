import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the player"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);
    const isStopSuccess = queue?.node.stop();

    if (isStopSuccess)
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: "Successfully stop the player",
            },
            { withPrefix: true }
          ),
        ],
      }));

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
  },
} as SlashCommandModule;
