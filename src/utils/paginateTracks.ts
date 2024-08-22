import { Track } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
import EmbedGenerator from "./EmbedGenerator";

export default async (
  tracks: Track<unknown>[],
  limit: number,
  userId: string,
  replyFunc: (
    embeds: EmbedBuilder[],
    currentPage: number,
    row: ActionRowBuilder<ButtonBuilder>
  ) => Promise<Message>
) => {
  const maxPage = Math.ceil(tracks.length / limit);
  let currentPage = 0;
  const embeds: EmbedBuilder[] = [];

  for (let page = 0; page < maxPage; page++) {
    const start = page * limit;
    const end = Math.min(start + limit, tracks.length);
    const slicedTracks = tracks.slice(start, end);

    if (!slicedTracks) continue;

    const embed = EmbedGenerator.Info({
      description: slicedTracks
        .map(
          (track, index) =>
            `**${start + index}**. [${track.title}](${
              track.url
            }) ~ [Requested by ${track?.requestedBy?.toString()}]`
        )
        .join("\n"),
      footer: {
        text: `Page ${page + 1} of ${maxPage} | Showing songs ${
          start + 1
        } to ${end} of ${slicedTracks.length}`,
      },
    });

    embeds.push(embed);
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("firstBtn")
      .setEmoji("⏪")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("previousBtn")
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("nextBtn")
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(maxPage <= 1),
    new ButtonBuilder()
      .setCustomId("lastBtn")
      .setEmoji("⏩")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(maxPage <= 1)
  );

  const message = await replyFunc(embeds, currentPage, row);

  const collector = message.createMessageComponentCollector({
    filter: (ctx) => ctx.user.id === userId,
    time: 2 * 60_000,
  });

  collector.on("collect", async (ctx) => {
    switch (ctx.customId) {
      case "firstBtn":
        currentPage = 0;
        break;
      case "previousBtn":
        if (currentPage > 0) currentPage--;
        break;
      case "nextBtn":
        if (currentPage < embeds.length - 1) currentPage++;
        break;
      case "lastBtn":
        currentPage = embeds.length - 1;
        break;
      default:
        break;
    }

    row.components[0].setDisabled(currentPage === 0);
    row.components[1].setDisabled(currentPage === 0);
    row.components[2].setDisabled(currentPage === embeds.length - 1);
    row.components[3].setDisabled(currentPage === embeds.length - 1);

    await ctx.update({
      embeds: [embeds[currentPage]],
      components: [row],
    });
  });

  collector.on("end", () => {
    row.components.forEach((component) => component.setDisabled(true));
    message.edit({ components: [row] });
  });
};
