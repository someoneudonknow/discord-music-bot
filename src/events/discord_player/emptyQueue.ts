import { CommandInteraction } from "discord.js";
import logger from "../../helpers/logger";
import { PlayerEventHandlerModule } from "../../types";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  type: "emptyQueue",
  once: false,
  execute: async (queue) => {
    const interaction = queue.metadata as CommandInteraction;

    if (interaction) {
      await interaction.channel?.send({
        embeds: [
          EmbedGenerator.Info(
            {
              title: "All tracks has been played!",
            },
            { withPrefix: true }
          ),
        ],
      });
    }
  },
} as PlayerEventHandlerModule<"emptyQueue">;
