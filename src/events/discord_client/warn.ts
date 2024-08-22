import { Client, Events } from "discord.js";
import { ClientEventHandlerModule } from "../../types";
import logger from "../../helpers/logger";

export default {
  type: Events.Warn,
  once: true,
  execute: async (client: Client, warnMessage: string) => {
    logger("warn", warnMessage);
  },
} as ClientEventHandlerModule<Events.Warn>;
