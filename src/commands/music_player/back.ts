import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useHistory, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Play previous track"),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const history = useHistory(interaction.guildId as string);

    if (!history || history.isEmpty())
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "There is no previous track to go back",
            },
            { withPrefix: true }
          ),
        ],
      });

    await history.previous();

    const prevTrack = history.currentTrack;

    return void (await interaction.editReply({
      embeds: [
        EmbedGenerator.Success(
          {
            title: "Went back to the previous song.",
            description: `Track ~ ${prevTrack}`,
          },
          { withPrefix: true }
        ),
      ],
    }));
  },
} as SlashCommandModule;
