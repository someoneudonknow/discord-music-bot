import { CommandInteraction } from "discord.js";
import { PlayerEventHandlerModule } from "../../types";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  type: "playerStart",
  once: false,
  execute: async (queue, track) => {
    const interaction = queue.metadata as CommandInteraction;

    return await interaction.channel?.send({
      embeds: [
        EmbedGenerator.Info(
          {
            title: `${track.title}`,
            url: track.url,
            thumbnail: {
              url: track.thumbnail,
            },
            fields: [
              { name: "Duration", value: track.duration, inline: true },
              {
                name: "Position in queue",
                value: String(queue.node.getTimestamp()?.current.value),
                inline: true,
              },
              {
                name: "Tracks left",
                value: String(queue.size),
                inline: true,
              },
            ],
            ...(track?.requestedBy && {
              author: {
                name: track.requestedBy.username,
                iconURL: track.requestedBy.displayAvatarURL(),
              },
            }),
          },
          { withPrefix: "▶ [Start playing] - " }
        ),
      ],
    });
  },
} as PlayerEventHandlerModule<"playerStart">;
