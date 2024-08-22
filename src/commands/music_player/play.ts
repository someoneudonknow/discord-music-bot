import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOption,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { QueryType, useMainPlayer, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";

const LEAVE_ON_EMPTY_COOLDOWN_IN_MINUTES = 5 * 60 * 1000;

export default {
  command: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Play and enqueue a track from given URL or the search result of a keyword"
    )
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Enter URL or keyword")
        .setRequired(true)
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    const player = useMainPlayer();

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          EmbedGenerator.Error(
            {
              title: "You are not in a voice channel!",
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    await interaction.deferReply();

    const query: CommandInteractionOption<CacheType> | null =
      interaction.options.get("query");

    if (query) {
      const { value } = query;

      const queryResult = await player.search(value as string, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!queryResult || !queryResult.hasTracks())
        return await interaction.editReply({
          embeds: [
            EmbedGenerator.Info(
              {
                title: `No results were found for ${value}`,
              },
              { withPrefix: true }
            ),
          ],
        });

      try {
        const { track, searchResult } = await player.play(
          interaction.member.voice.channel,
          queryResult,
          {
            nodeOptions: {
              metadata: interaction,
            },
          }
        );
        const queue = useQueue(interaction.guildId as string);

        let fields: { name: string; value: string; inline: true }[] = [
          {
            name: "Queue size",
            value: String(queue?.size) || "Unknown",
            inline: true,
          },
        ];

        if (searchResult.playlist) {
          fields = [
            ...fields,
            {
              name: "Playlist",
              value: searchResult.playlist.title,
              inline: true,
            },
          ];
        }

        return await interaction.editReply({
          embeds: [
            EmbedGenerator.Success(
              {
                title: `${
                  searchResult.hasPlaylist() ? "Playlist" : "Track"
                } queued!`,
                thumbnail: { url: track.thumbnail },
                description: `[${track.title}](${track.url})`,
                fields,
                author: {
                  name: interaction.user.username,
                  iconURL: interaction.user.displayAvatarURL(),
                },
              },
              { withPrefix: true }
            ),
          ],
        });
      } catch (e: any) {
        return await interaction.editReply({
          embeds: [
            EmbedGenerator.Error(
              {
                title: "Something went wrong",
                description: `Something went wrong while trying to play \`${query}\``,
                author: {
                  name: interaction.user.username,
                  iconURL: interaction.user.displayAvatarURL(),
                },
              },
              { withPrefix: true }
            ),
          ],
        });
      }
    }
  },
} as SlashCommandModule;
