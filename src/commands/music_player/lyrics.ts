import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useHistory, useMainPlayer, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import play from "./play";

export default {
  command: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get lyrics for a song.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The title of a song to get lyrics for.")
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guildId as string);
    const input = interaction.options.get("query");

    let query = input?.value as string;

    if (!query && !queue?.currentTrack) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: "Provide a song title to get lyrics.",
            },
            { withPrefix: true }
          ),
        ],
      }));
    }

    if (!query)
      query = `${queue?.currentTrack?.author} - ${queue?.currentTrack?.cleanTitle}`;

    const player = useMainPlayer();

    const lyrics = await player.lyrics.search({
      q: query,
    });

    if (!lyrics.length)
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No lyrics found!",
            },
            { withPrefix: true }
          ),
        ],
      }));

    const trimmedLyrics =
      lyrics[0]?.syncedLyrics?.substring(0, 4096) ||
      lyrics[0].plainLyrics.substring(0, 4096);

    const embed = EmbedGenerator.Success({
      title: lyrics[0].name,
      author: {
        name: lyrics[0].artistName,
      },
      description:
        trimmedLyrics.length === 4096 ? `${trimmedLyrics}...` : trimmedLyrics,
    });

    return void (await interaction.editReply({ embeds: [embed] }));
  },
} as SlashCommandModule;
