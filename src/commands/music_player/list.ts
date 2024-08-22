import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { Track, useHistory, useQueue } from "discord-player";
import EmbedGenerator from "../../utils/EmbedGenerator";
import paginateTracks from "../../utils/paginateTracks";

export default {
  command: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List all tracks information")
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("List tracks from history or queue")
        .addChoices([
          { name: "queue", value: "queue" },
          { name: "history", value: "history" },
        ])
        .setRequired(true)
    ),
  callback: async (_: Client, interaction: CommandInteraction) => {
    const queue = useQueue(interaction.guildId as string);
    const history = useHistory(interaction.guildId as string);

    const from = interaction.options.get("from");

    if (!from)
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "Choose a place to load tracks!",
            },
            { withPrefix: true }
          ),
        ],
      });

    await interaction.deferReply();

    const { value } = from;

    if (value === "queue" && (!queue || queue?.isEmpty())) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No tracks found!",
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    if (value === "history" && (!history || history?.isEmpty())) {
      return await interaction.editReply({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "No tracks found!",
            },
            { withPrefix: true }
          ),
        ],
      });
    }

    const limit = 10;
    let tracks =
      value === "queue" ? queue?.tracks.toArray() : history?.tracks.toArray();

    if (!tracks) tracks = [];

    return await paginateTracks(
      tracks,
      limit,
      interaction.user.id,
      async (embeds, currentPage, row) =>
        await interaction.editReply({
          embeds: [embeds[currentPage]],
          components: [row],
        })
    );
  },
} as SlashCommandModule;
